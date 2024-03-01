import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { IoMdAdd } from "react-icons/io";
import TaskCard from "../TaskCard/TaskCard";
import TaskModal from "../TaskModel/TaskModel";
import styles from "./Board.module.css";
import { format } from "date-fns";
import Group from "../../images/Group.png";
import BaseUrl from "../BaseUrl/BaseUrl";
import UpdateTasksModal from "../UpdateTasksModal/UpdateTasksModal";
const Board = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const [timeFilter, setTimeFilter] = useState("week");
  const [collapsedColumns, setCollapsedColumns] = useState({
    Backlog: false,
    "To-Do": false,
    Progress: false,
    Done: false,
  });
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const handleUpdateClick = () => {
    setShowUpdateModal(true);
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks((prevTasks) => {
      return prevTasks.map((task) =>
        task._id === updatedTask._id ? updatedTask : task
      );
    });
  };

  const toggleTaskVisibility = (column) => {
    setCollapsedColumns((prev) => ({ ...prev, [column]: !prev[column] }));
  };

  const handleSelectChange = (e) => {
    setTimeFilter(e.target.value);
  };
  const removeTaskFromState = (taskId) => {
    setTasks((currentTasks) =>
      currentTasks.filter((task) => task._id !== taskId)
    );
  };

  const [name, setName] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchUserName = async () => {
      setIsFetching(true);
      try {
        const response = await axios.get(`${BaseUrl}/user/getName`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status !== 200) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        setName(response.data.name);
      } catch (error) {
        console.error("Fetching user name failed", error);
        setErrorMessage("Failed to fetch user name");
      } finally {
        setIsFetching(false);
      }
    };

    if (token) {
      fetchUserName();
    } else {
      setErrorMessage("Authentication token is not available.");
      setIsFetching(false);
    }
  }, [token]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(
          `${BaseUrl}/tasks/gettasks/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTasks(response.data);
      } catch (error) {
        console.error("Fetch error:", error.message);
      }
    };

    fetchTasks();
  }, [userId]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleChecklistChange = async (taskId, itemId, isCompleted) => {
    try {
      const response = await axios.put(
        `${BaseUrl}/tasks/${taskId}/checklist/${itemId}`,
        { isCompleted }, // Adjusted to match backend expectations
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedTask = response.data.task;
      setTasks((currentTasks) =>
        currentTasks.map((task) => (task._id === taskId ? updatedTask : task))
      );
    } catch (error) {
      console.error("Error updating checklist:", error);
    }
  };

  const handleStatusUpdate = async (taskId, newStatus) => {
    try {
      const response = await axios.put(
        `${BaseUrl}/tasks/${taskId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedTask = response.data.task;
      setTasks((currentTasks) =>
        currentTasks.map((task) => (task._id === taskId ? updatedTask : task))
      );
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        console.log(`Fetching tasks with time frame: ${timeFilter}`);
        const response = await axios.get(
          `${BaseUrl}/tasks/filter?timeFrame=${timeFilter}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Tasks fetched successfully:", response.data);
        setTasks(response.data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    if (userId && token) {
      fetchTasks();
    } else {
      console.log("Missing userId or token");
    }
  }, [timeFilter, userId, token]);

  const getCurrentDate = () => {
    return format(new Date(), "dd MMM, yyyy");
  };
  const handleAddNewTask = (newTask) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const handleTaskUpdateInBoard = (updatedTask) => {
    setTasks(
      tasks.map((task) => (task._id === updatedTask._id ? updatedTask : task))
    );
  };

  return (
    <div className={styles.boardContainer}>
      <div className={styles.userInfo}>
        <div className={styles.userName}>
          {isFetching ? (
            <p>Loading user info...</p>
          ) : name ? (
            <div>Welcome, {name}</div>
          ) : (
            <p>{errorMessage}</p>
          )}
        </div>

        <p className={styles.currentDate}>
          <div>{getCurrentDate()}</div>
        </p>

        <div className={styles.filterDropdown}>
          <select
            value={timeFilter}
            className={styles.handledate}
            onChange={handleSelectChange}
          >
            <option className={styles.option} value="today">
              Today
            </option>
            <option className={styles.option} value="week">
              This Week
            </option>
            <option className={styles.option} value="month">
              This Month
            </option>
          </select>
        </div>

        <h2 className={styles.heading}>Board</h2>
      </div>

      <div className={styles.boardscroll}>
        <div className={styles.board}>
          {["Backlog", "To-Do", "Progress", "Done"].map((status) => (
            <div key={status} className={styles.column}>
              <div className={styles.flex}>
                <div className={styles.columnHeader}>{status}</div>
                {status === "To-Do" && (
                  <button
                    onClick={handleOpenModal}
                    className={styles.addButton}
                  >
                    <IoMdAdd />
                  </button>
                )}
                <img
                  onClick={() => toggleTaskVisibility(status)}
                  className={styles.group}
                  src={Group}
                  alt="Collapse all"
                />
              </div>
              <ul className={styles.taskList}>
                {tasks
                  .filter(
                    (task) =>
                      task.status === status && !collapsedColumns[status]
                  )
                  .map((task) => (
                    <TaskCard
                      key={task._id}
                      title={task.title}
                      priority={task.priority}
                      checklist={task.checklist}
                      dueDate={task.dueDate}
                      taskId={task._id}
                      currentStatus={task.status}
                      markedChecklistCount={
                        task.checklist.filter((item) => item.isCompleted).length
                      }
                      totalChecklistCount={task.checklist.length}
                      handleChecklistChange={handleChecklistChange}
                      handleStatusUpdate={handleStatusUpdate}
                      onTaskDelete={removeTaskFromState}
                      task={tasks}
                      onTaskUpdate={handleTaskUpdate}
                    />
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      {isModalOpen && (
        <TaskModal onClose={handleCloseModal} onSave={handleAddNewTask} />
      )}
      {showUpdateModal && (
        <UpdateTasksModal
          isOpen={showUpdateModal}
          onClose={() => setShowUpdateModal(false)}
        />
      )}
    </div>
  );
};

export default Board;
