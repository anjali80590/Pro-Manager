import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Analytics.module.css";
import BaseUrl from "../BaseUrl/BaseUrl";
const Analytics = () => {
  const [taskCounts, setTaskCounts] = useState({
    totalBacklogTasks: 0,
    totalTodoTasks: 0,
    totalProgressTasks: 0,
    totalDoneTasks: 0,
    highPriorityTasksCount: 0,
    mediumPriorityTasksCount: 0,
    lowPriorityTasksCount: 0,
    dueDatePassedTasksCount: 0,
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token"); 
        const userId = localStorage.getItem("userId");
        if (!token) {
          throw new Error("Token not found");
        }

        const response = await axios.get(
          `${BaseUrl}/tasks/alltasks/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTaskCounts(response.data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []);

  const formatNumber = (number) =>
    number < 10 ? `0${number}` : number.toString();

  return (
    <div className={styles.container}>
   
      <div className={styles.box}>
   <div className={styles.title}>Analytics</div>
        <ul className={styles.list}>
          <li className={styles.listItem}>
            Backlog Tasks {" "}
            <span className={styles.count}>
              {formatNumber(taskCounts.totalBacklogTasks)}
            </span>
          </li>
          <li className={styles.listItem}>
            To-Do Tasks {" "}
            <span className={styles.count}>
              {formatNumber(taskCounts.totalTodoTasks)}
            </span>
          </li>
          <li className={styles.listItem}>
            In-Progress Tasks {" "}
            <span className={styles.count}>
              {formatNumber(taskCounts.totalProgressTasks)}
            </span>
          </li>
          <li className={styles.listItem}>
            Completed Tasks {" "}
            <span className={styles.count}>
              {formatNumber(taskCounts.totalDoneTasks)}
            </span>
          </li>
        </ul>
      </div>
      <div className={styles.box}>
        <ul className={styles.list}>
        <li className={styles.listItem}>
            Low Priority {" "}
            <span className={styles.count}>
              {formatNumber(taskCounts.lowPriorityTasksCount)}
            </span>
          </li>
          <li className={styles.listItem}>
            Moderate Priority {" "}
            <span className={styles.count}>
              {formatNumber(taskCounts.mediumPriorityTasksCount)}
            </span>
          </li>
          <li className={styles.listItem}>
            High Priority {" "}
            <span className={styles.count}>
              {formatNumber(taskCounts.highPriorityTasksCount)}
            </span>
          </li>
         
        
          <li className={styles.listItem}>
            Due Date Tasks{" "}
            <span className={styles.count}>
              {formatNumber(taskCounts.dueDatePassedTasksCount)}
            </span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Analytics;
