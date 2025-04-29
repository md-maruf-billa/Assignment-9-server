const loginUser = async (payload: { email: string; password: string }) => {
  console.log('Login payload:', payload);
};

export const AuthService = {
  loginUser,
};
