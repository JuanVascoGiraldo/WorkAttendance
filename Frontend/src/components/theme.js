export const theme = {
  color1: "#0f172a",
  color2: "#1d3557",
  color3: "#e76f51",
  color4: "#dbe3ee",
  color5: "#ffffff",
  color6: "#f4f7fb",
  radiusSm: "10px",
  radiusMd: "16px",
};

export const cardStyle = {
  backgroundColor: "rgba(255,255,255,0.94)",
  border: `1px solid ${theme.color4}`,
  borderRadius: theme.radiusMd,
  padding: "20px",
  boxShadow: "0 16px 34px rgba(29,53,87,0.12)",
  backdropFilter: "blur(4px)",
};

export const inputStyle = {
  width: "100%",
  padding: "11px 13px",
  borderRadius: theme.radiusSm,
  border: `1px solid ${theme.color4}`,
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box",
  backgroundColor: theme.color5,
};

export const buttonPrimaryStyle = {
  backgroundColor: theme.color3,
  color: theme.color5,
  border: "none",
  borderRadius: theme.radiusSm,
  padding: "10px 16px",
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 10px 20px rgba(231,111,81,0.25)",
};
