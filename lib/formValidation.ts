function isValidEmail(email: string) {
  const re =
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  return re.test(String(email).toLowerCase())
}

function isStrongPassword(password: string): boolean {
  let expression = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,20}$/
  return password.match(expression) == null ? false : true
} 

export { isValidEmail, isStrongPassword }