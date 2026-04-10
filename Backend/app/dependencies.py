"""Dependency injection container for FastAPI.

This module is intentionally generic: it does not implement business services or
database clients. You can register your own abstractions and implementations,
for example:

container.add_dependency(UserRepository, UserRepositoryImpl)
container.add_env_dependency(MongoClient, MongoClientImpl, MongoTestClient)
"""

from __future__ import annotations

from collections.abc import Callable
from functools import lru_cache
from inspect import Parameter, isabstract, isclass, signature
from logging import Logger, getLogger
from typing import Any, TypeVar, get_type_hints

from app.config import Config, get_settings
from app.domain.repositories import UserRepository
from app.infrastructure.persistance.mongodb.clients import MongoClient, MongoClientImpl, MongoTestClient
from app.infrastructure.persistance.mongodb.user_repository import UserRepositoryImpl


T = TypeVar("T")


class DependencyContainer:
	"""Minimal IoC container with singleton and factory support."""

	def __init__(self) -> None:
		self._providers: dict[type[Any], Callable[[DependencyContainer], Any]] = {}
		self._singletons: dict[type[Any], Any] = {}

	def add_built_dependency(self, interface: type[T], instance: T) -> None:
		self._singletons[interface] = instance

	# Compatibility alias if you prefer add_builded_dependency naming.
	def add_builded_dependency(self, interface: type[T], instance: T) -> None:
		self.add_built_dependency(interface, instance)

	def add_dependency(
		self,
		interface: type[T],
		implementation: type[T],
		*,
		singleton: bool = False,
	) -> None:
		def provider(container: DependencyContainer) -> T:
			if singleton and interface in container._singletons:
				return container._singletons[interface]

			instance = container._build(implementation)

			if singleton:
				container._singletons[interface] = instance
			return instance

		self._providers[interface] = provider

	def add_env_dependency(
		self,
		interface: type[T],
		production_implementation: type[T],
		test_implementation: type[T],
		*,
		singleton: bool = False,
	) -> None:
		settings = self.get(Config)
		implementation = (
			test_implementation if settings.is_test() else production_implementation
		)
		self.add_dependency(interface, implementation, singleton=singleton)

	def get(self, interface: type[T]) -> T:
		if interface in self._singletons:
			return self._singletons[interface]

		provider = self._providers.get(interface)
		if provider is None:
			# Handlers and other concrete classes are auto-wired by constructor hints.
			if isclass(interface) and not isabstract(interface):
				return self._build(interface)
			name = interface.__name__ if hasattr(interface, "__name__") else str(interface)
			raise ValueError(f"No provider registered for {name}")

		return provider(self)

	def _build(self, implementation: type[T]) -> T:
		params = signature(implementation.__init__).parameters
		type_hints = get_type_hints(implementation.__init__)
		dependencies: dict[str, Any] = {}

		for name, param in params.items():
			if name == "self":
				continue

			dependency_type = type_hints.get(name)
			if dependency_type is None or param.annotation is Parameter.empty:
				raise TypeError(
					f"Missing type annotation in {implementation.__name__}.__init__ for '{name}'"
				)

			dependencies[name] = self.get(dependency_type)

		return implementation(**dependencies)


def build_dependencies(
	register_dependencies: Callable[[DependencyContainer], None] | None = None,
) -> DependencyContainer:
    container = DependencyContainer()
    container.add_built_dependency(Config, get_settings())
    container.add_built_dependency(Logger, getLogger(__name__))

    if get_settings().is_test():
        container.add_dependency(MongoClient, MongoTestClient, singleton=True)
    else:
        container.add_dependency(MongoClient, MongoClientImpl, singleton=True)

    container.add_dependency(UserRepository, UserRepositoryImpl, singleton=True)

    if register_dependencies is not None:
        register_dependencies(container)

    return container


@lru_cache
def get_dependencies_container() -> DependencyContainer:
	return build_dependencies()


def get_dependency(interface: type[T]) -> T:
	return get_dependencies_container().get(interface)


def dependency_provider(interface: type[T]) -> Callable[[], T]:
	def _provider() -> T:
		return get_dependency(interface)

	return _provider


