import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { confirmAlert } from "react-confirm-alert"; // Import
import "react-confirm-alert/src/react-confirm-alert.css";
import "react-tooltip/dist/react-tooltip.css";
import Select from "react-select";

const Home = () => {
  const [userData, setUserData] = useState("");
  const [addTask, setAddTask] = useState("");
  const [addDate, setAddDate] = useState("");
  const [taskData, setTaskData] = useState([]);
  const [reload, setReload] = useState(false);
  const [task, setTask] = useState("");
  const [selectedOption, setSelectedOption] = useState(taskData.status);
  const [editTaskTask, setEditTaskTask] = useState(taskData.task);
  const [editTaskDate, setEditTaskDate] = useState(taskData.date);

  const getUser = async (id) => {
    const data = await axios.get(`https://todo-server-7vg8.onrender.com/getUser/${id}`);
    setUserData(data.data);
  };

  const handleLogout = async () => {
    sessionStorage.clear();
    toast.success(`Logout Successfully`, {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [show1, setShow1] = useState(false);
  const handleClose1 = () => setShow1(false);
  const handleShow1 = () => setShow1(true);

  const SubmitTask = async () => {
    const id = sessionStorage.getItem("user");
    if (!addDate || !addTask) {
      toast.warning(`Fields are required`, {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      const sendTask = await axios.post(`https://todo-server-7vg8.onrender.com/addTask/${id}`, {
        date: addDate,
        task: addTask,
      });
      if (sendTask.data.status == 200) {
        toast.success(`${sendTask.data.msg}`, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setShow(false);
        setReload(reload === true ? false : true);
      }
    }
  };

  const getTaskList = async (id) => {
    const data = await axios.get(`https://todo-server-7vg8.onrender.com/getUsersTask/${id}`);
    setTaskData(data.data);
  };

  const options = [
    { value: "Done", label: "Done" },
    { value: "Pending", label: "Pending" },
  ];

  //   const changeStautus = async (id) => {
  //     alert(id);
  //   };

  const deleteTask = async (id) => {
    confirmAlert({
      title: "Delete this task?",
      message: "Are you sure to do this.",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            const task = await axios.delete(
              `https://todo-server-7vg8.onrender.com/deleteTask/${id}`
            );
            if (task.data.status == 200) {
              toast.success(`${task.data.msg}`, {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
              });
              setReload(reload === true ? false : true);
            }
          },
        },
        {
          label: "No",
          //   onClick: () => alert("Click No"),
        },
      ],
    });
  };

  const getTask = async (id) => {
    handleShow1();
    const task = await axios.get(`https://todo-server-7vg8.onrender.com/getTask/${id}`);
    setTask(task.data);
    setEditTaskDate(task.data.date);
    setEditTaskTask(task.data.task);
    setSelectedOption(task.data.status);
  };

  const submitEditTask = async (id) => {
    const value = {
      task: editTaskTask,
      date: editTaskDate,
      status: selectedOption.value,
    };
    const sendData = await axios.post(
      `https://todo-server-7vg8.onrender.com/updateTask/${id}`,
      value
    );
    if (sendData.data.status == 200) {
      toast.success(`${sendData.data.msg}`, {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      handleClose1();
      setReload(reload === true ? false : true);
    }
  };
  useEffect(() => {
    const id = sessionStorage.getItem("user");
    getUser(id);
    getTaskList(id);
  }, [reload]);
  return (
    <>
      <header class=" text-bg-dark pt-4">
        <div class="container">
          <div class="d-flex flex-wrap  justify-content-between">
            <div>
              <h3>
                Welcome :<span className="fw-bold"> {userData.name}</span>
              </h3>
            </div>
            <div class="text-end">
              {/* <button type="button" class="btn btn-danger me-2">Login</button> */}
              <button
                type="button"
                class="btn btn-warning"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>
      <div className="container ">
        <hr />
      </div>
      <div className="d-flex justify-content-end container pt-3">
        <button type="button" class="btn btn-primary" onClick={handleShow}>
          Add Task
        </button>
      </div>

      {taskData.length == 0 ? (
        <div className="container">
          <p className="fw-bold">No task to show !</p>
          <p>Add some tasks ...</p>
        </div>
      ) : (
        <div className="container mt-3 col-8 pt-3">
          <table class="table table-hover table-bordered">
            <thead>
              <tr className="text-center">
                <th scope="col">No.</th>
                <th scope="col">Task</th>
                <th scope="col">Date</th>
                <th scope="col">Status</th>
                <th scope="col" className="col-2">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {taskData.map((e, id) => {
                return (
                  <>
                    <tr className="text-center">
                      <th scope="row">{id + 1}</th>
                      <td>{e.task}</td>
                      <td>{e.date}</td>
                      <td>
                        {e.status === "false" ? (
                          <button type="button" class="btn-sm btn btn-warning">
                            Pending
                          </button>
                        ) : (
                          <button type="button" class=" btn-sm btn btn-success">
                            Done
                          </button>
                        )}
                      </td>
                      <td>
                        <div className="d-flex justify-content-between">
                          <button
                            type="button"
                            id="edit-ToolTip"
                            class=" btn-sm btn btn-primary"
                            onClick={() => getTask(e._id)}
                          >
                            <i class="bi bi-pencil-fill"></i>
                          </button>

                          {/* <button
                          type="button"
                          class=" btn-sm btn btn-success"
                          onClick={() => {
                            changeStautus(e._id);
                          }}
                          id="status-ToolTip"
                        >
                          <i class="bi bi-check-circle"></i>
                        </button> */}
                          <button
                            type="button"
                            class=" btn-sm btn btn-danger"
                            id="delete-ToolTip"
                            onClick={() => deleteTask(e._id)}
                          >
                            <i class="bi bi-trash-fill"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div class="mb-3">
              <label for="exampleInputEmail1" class="form-label">
                Enter Task
              </label>
              <input
                type="text"
                class="form-control"
                id="text"
                onChange={(e) => setAddTask(e.target.value)}
              />
            </div>
            <div class="mb-3">
              <label for="exampleInputEmail1" class="form-label">
                Pick Date
              </label>
              <input
                type="date"
                class="form-control"
                id="date"
                onChange={(e) => setAddDate(e.target.value)}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={(() => handleClose, SubmitTask)}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={show1} onHide={handleClose1}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task : {task.task}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form>
            <div class="mb-3">
              <label for="exampleInputEmail1" class="form-label">
                Enter Task
              </label>
              <input
                type="text"
                class="form-control"
                id="text"
                defaultValue={task.task}
                onChange={(e) => setEditTaskTask(e.target.value)}
              />
            </div>
            <div class="mb-3">
              <label for="exampleInputEmail1" class="form-label">
                Pick Date
              </label>
              <input
                type="date"
                class="form-control"
                id="date"
                defaultValue={task.date}
                onChange={(e) => setEditTaskDate(e.target.value)}
              />
            </div>
            <div class="mb-3">
              <label for="exampleInputEmail1" class="form-label">
                Change Status
              </label>
              <Select
                defaultValue={selectedOption}
                onChange={setSelectedOption}
                options={options}
              />
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose1}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              submitEditTask(task._id);
            }}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default Home;
