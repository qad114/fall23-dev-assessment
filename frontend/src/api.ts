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
  const response = await fetch('http://localhost:5000/api/bog/users');
  const json = await response.json();
  return json;
}

export async function addUser(user: User) {
  await fetch('http://localhost:5000/api/bog/adduser', {
    method: 'POST',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  })
}

export async function updateUser(user: User) {
  await fetch('http://localhost:5000/api/bog/updateuser', {
    method: 'PUT',
    headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify(user)
  });
}

export async function deleteUser(id: string) {
  await fetch('http://localhost:5000/api/bog/deleteuser/' + id, {
    method: 'DELETE'
  });
}