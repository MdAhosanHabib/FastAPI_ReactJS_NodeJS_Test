import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css'; 
import { useEffect, useState } from "react";

function EmployeeCrud() {
  const [_id, setId] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setMobile] = useState("");
  const [employees, setUsers] = useState([]);

  useEffect(() => {
    (async () => await Load())();
  }, []);

  async function Load() {
    const result = await axios.get("http://localhost:8000/api/todo");
    setUsers(result.data.data);
    console.log(result.data);
  }

  async function save(event) {
    event.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/todo/", {
        name: name,
        address: address,
        phone: phone,
      });
      alert("Task Save Successfully");
      setId("");
      setName("");
      setAddress("");
      setMobile("");
      Load();
    } catch (err) {
      alert("Task Save Failed");
    }
  }
  async function editEmployee(employees) {
    setName(employees.name);
    setAddress(employees.address);
    setMobile(employees.phone);

    setId(employees._id);
  }

  async function DeleteEmployee(_id) {
    await axios.delete("http://localhost:8000/api/todo/" + _id);
    alert("Task deleted Successfully");
    Load();
  }

  async function update(event) {
    event.preventDefault();
    try {
      await axios.patch(
        "http://localhost:8000/api/todo/update/" +
          employees.find((u) => u._id === _id)._id || _id,
        {
          _id: _id,
          name: name,
          address: address,
          phone: phone,
        }
      );
      alert("Task Updated");
      setId("");
      setName("");
      setAddress("");
      setMobile("");
      Load();
    } catch (err) {
      alert(err);
    }
  }

  return (
    <div>
      <h1 class="text-center">Ahosan's NoteBook</h1>
      <div class="container mt-4">
        <form>
          <div class="form-group">
            <input
              type="text"
              class="form-control"
              id="_id"
              hidden
              value={_id}
              onChange={(event) => {
                setId(event.target.value);
              }}
            />
            <label>Task Name</label>
            <input
              type="text"
              class="form-control"
              id="name"
              value={name}
              onChange={(event) => {
                setName(event.target.value);
              }}
            />
          </div>
          <div class="form-group">
            <label>Task Date</label>
            <input
              type="text"
              class="form-control"
              id="address"
              value={address}
              onChange={(event) => {
                setAddress(event.target.value);
              }}
            />
          </div>

          <div class="form-group">
            <label>Task Status</label>
            <input
              type="text"
              class="form-control"
              id="phone"
              value={phone}
              onChange={(event) => {
                setMobile(event.target.value);
              }}
            />
          </div>

          <div class="text-center">
            <button class="btn btn-primary mt-4" onClick={save}>
              Save
            </button>
            <button class="btn btn-warning mt-4" onClick={update}>
              Update
            </button>
          </div>
          <div>
          <br></br>
          </div>
        </form>
      </div>

      <table class="table table-dark" align="center">
        <thead>
          <tr>
            <th scope="col">Task Id</th>
            <th scope="col">Task Name</th>
            <th scope="col">Task Date</th>
            <th scope="col">Task Status</th>

            <th scope="col">Option</th>
          </tr>
        </thead>
        {employees && employees.map(function fn(employee) {
          return (
            <tbody>
              <tr>
                <th scope="row">{employee._id} </th>
                <td>{employee.name}</td>
                <td>{employee.address}</td>
                <td>{employee.phone}</td>
                <td>
                  <button
                    type="button"
                    class="btn btn-warning"
                    onClick={() => editEmployee(employee)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    class="btn btn-danger"
                    onClick={() => DeleteEmployee(employee._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          );
        })}
      </table>
    </div>
  );
}

export default EmployeeCrud;
