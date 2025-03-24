import bcrypt from "bcryptjs";

const hassPassword = (password: string): string => {
  const salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, salt);
};

// export
export default hassPassword;
