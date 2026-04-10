import UserForm from "./UserForm";

function EditUserForm({ defaultValues, ...props }) {
  if (!defaultValues) {
    return null;
  }

  return (
    <UserForm
      title={`Modificar usuario: ${defaultValues.first_name} ${defaultValues.last_name}`}
      submitLabel="Actualizar"
      defaultValues={defaultValues}
      {...props}
    />
  );
}

export default EditUserForm;