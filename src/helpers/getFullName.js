export function getFullName(firstName, lastName) {
  if (firstName && lastName) {
    return (firstName + " " + lastName).trim();
  } else if (firstName) {
    return firstName.trim();
  } else if (lastName) {
    return lastName.trim();
  } else {
    return "";
  }
}
