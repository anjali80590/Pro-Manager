import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import styles from "./ShareTasks.module.css";
import codesandbox from '../../images/codesandbox.png'
import BaseUrl from "../BaseUrl/BaseUrl";
const ShareTasks = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${BaseUrl}/tasks/${taskId}`)
      .then((response) => {
        setTask(response.data);
      })
      .catch((error) => {
        setError("Task not found or an error occurred.");
      });
  }, [taskId]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!task) {
    return <div>Loading...</div>;
  }

  const dueDateElement = task.dueDate ? (
    <div>
      <button className={styles.dueDateButton}>
        {format(new Date(task.dueDate), "MMM dd")}
      </button>
    </div>
  ) : null;

  const getPriorityDot = (priority) => {
    const dotStyle = {
      height: "5px",
      width: "5px",
      backgroundColor: "#bbb",
      borderRadius: "50%",
      display: "inline-block",
      marginRight: "5px",
    };

    switch (priority) {
      case "High":
        dotStyle.backgroundColor = "#FF2473";
        break;
      case "Medium":
        dotStyle.backgroundColor = "#18B0FF";
        break;
      case "Low":
        dotStyle.backgroundColor = "#63C05B";
        break;
      default:
        dotStyle.backgroundColor = "grey";
    }

    return <span style={dotStyle} />;
  };

  const completedCount = task.checklist.reduce(
    (count, item) => count + (item.isCompleted ? 1 : 0),
    0
  );

  return (
   <div className={styles.sharetask}>
    <div className={styles.sharelogo}> <img src={codesandbox}/> Pro Manage</div>
      <div className={styles.taskCard}>
      <div className={styles.priority}>
        {getPriorityDot(task.priority)}
        <span >{task.priority} priority</span>
      </div>
      <h1 className={styles.taskTitle}>{task.title}</h1>

      <div>
        <p className={styles.check}>
          Checklist ({completedCount}/{task.checklist.length})
        </p>
        <ul className={styles.checklist}>
          {task.checklist.map((item) => (
            <li key={item._id} className={styles.checklistItem}>
              <label>
                <input type="checkbox" checked={item.isCompleted} className={styles.checkbox} readOnly />
                <span
                  className={item.isCompleted ? styles.completedTaskText : ""}
                >
                  {item.text}
                </span>
              </label>
            </li>
          ))}
     
        </ul>
        {task.dueDate && (
          <div className={styles.dateBox}>
            <span className={styles.apiDueDate}>Due Date </span>
            {dueDateElement}
          </div>)}
      </div>
    </div>
   </div>
  );
};

export default ShareTasks;
