export type User = {
  name: string,
  avatar: string,
  hero_project: string,
  notes: string,
  email: string,
  phone: string,
  rating: string,
  status: boolean,
  id: string
}

export async function getUsers(): Promise<User[]> {
  const response = await fetch("http://localhost:5000/api/bog/users");
  const json = await response.json();
  return json;
}