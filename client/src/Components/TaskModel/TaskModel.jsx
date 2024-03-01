import React, { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./TaskModal.module.css";
import Delete from "../../images/Delete.png";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import plus from "../../images/plus.png";
import BaseUrl from "../BaseUrl/BaseUrl";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TaskModal = ({ onClose, onSave }) => {
  const [task, setTask] = useState({
    title: "",
    priority: "",
    checklist: [],
    dueDate: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask({ ...task, [name]: value });
  };

  const handleRadioChange = (priorityValue) => {
    setTask((prevTask) => ({ ...prevTask, priority: priorityValue }));
  };

  const handleDateChange = (date) => {
    console.log("New date selected:", date);
    setTask({ ...task, dueDate: date });
  };

  const handleChecklistChange = (index) => {
    setTask((prevTask) => ({
      ...prevTask,
      checklist: prevTask.checklist.map((item, i) =>
        i === index ? { ...item, isCompleted: !item.isCompleted } : item
      ),
    }));
  };

  const handleChecklistTextChange = (text, index) => {
    setTask((prevTask) => ({
      ...prevTask,
      checklist: prevTask.checklist.map((item, i) =>
        i === index ? { ...item, text: text } : item
      ),
    }));
  };

  // const handleAddChecklistItem = () => {
  //   setTask((prevTask) => ({
  //     ...prevTask,
  //     checklist: [
  //       ...prevTask.checklist,
  //       { id: prevTask.checklist.length, text: "", isCompleted: false },
  //     ],
  //   }));
  // };
  const handleAddChecklistItem = () => {
    setTask((prevTask) => ({
      ...prevTask,
      checklist: [
        ...prevTask.checklist,
        { id: Date.now(), text: "", isCompleted: false },
      ],
    }));
  };

  const handleDeleteChecklistItem = (index) => {
    setTask((prevTask) => ({
      ...prevTask,
      checklist: prevTask.checklist.filter((_, i) => i !== index),
    }));
  };

  const handleSave = async () => {
    if (!task.title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!task.priority.trim()) {
      toast.error("Priority is required");
      return;
    }

    if (
      task.checklist.length === 0 ||
      !task.checklist.some((item) => item.text.trim())
    ) {
      toast.error("At least one checklist item is required");
      return;
    }
    if (
      task.checklist.length === 0 ||
      task.checklist.some((item) => !item.text.trim())
    ) {
      toast.error("All checklist items must be filled out");
      return;
    }
    const dueDateISO = task.dueDate
      ? new Date(task.dueDate).toISOString()
      : null;

    const postData = {
      title: task.title,
      priority: task.priority,
      checklist: task.checklist,
      dueDate: dueDateISO,
    };

    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      const response = await fetch(`${BaseUrl}/tasks/posttasks/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();

      console.log("Success:", responseData);

      onSave(responseData);

      onClose();
    } catch (error) {
      console.error("Error during POST request:", error.message);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.title}>
          Title <span className={styles.required}>*</span>
        </div>
        <input
          type="text"
          name="title"
          placeholder="Enter Task Title"
          value={task.title}
          onChange={handleChange}
          className={styles.taskInput}
        />
        <div className={styles.prioritySection}>
          <div className={styles.color}>
            <div>
              Select Priority <span className={styles.required}>*</span>
            </div>
          </div>
          <div
            className={`${styles.customRadioButton} ${
              task.priority === "High" ? styles.selectedPriority : ""
            }`}
            onClick={() => handleRadioChange("High")}
          >
            <div
              className={`${styles.radioDot} ${styles.highPriorityDot}`}
            ></div>
            HIGH PRIORITY
          </div>
          <div
            className={`${styles.customRadioButton} ${
              task.priority === "Medium" ? styles.selectedPriority : ""
            }`}
            onClick={() => handleRadioChange("Medium")}
          >
            <div
              className={`${styles.radioDot} ${styles.mediumPriorityDot}`}
            ></div>
            MODERATE PRIORITY
          </div>
          <div
            className={`${styles.customRadioButton} ${
              task.priority === "Low" ? styles.selectedPriority : ""
            }`}
            onClick={() => handleRadioChange("Low")}
          >
            <div
              className={`${styles.radioDot} ${styles.lowPriorityDot}`}
            ></div>
            LOW PRIORITY
          </div>
        </div>

        <div className={styles.checklistContainer}>
          <label className={styles.checklistLength}>
            Checklist (
            {task.checklist.filter((item) => item.isCompleted).length}/
            {task.checklist.length})<span className={styles.required}>*</span>
          </label>
          <div className={styles.scrollableChecklistContainer}>
            {task.checklist.map((item, index) => (
              <div key={item.id} className={styles.checklistItem}>
                <input
                  type="checkbox"
                  checked={item.isCompleted}
                  onChange={() => handleChecklistChange(index)}
                />
                <input
                  type="text"
                  placeholder="Add task"
                  value={item.text}
                  onChange={(e) =>
                    handleChecklistTextChange(e.target.value, index)
                  }
                />
                <button
                  onClick={() => handleDeleteChecklistItem(index)}
                  className={styles.deleteButton}
                >
                  <img className={styles.del} src={Delete} />
                </button>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={handleAddChecklistItem}
          className={styles.addNewButton}
        >
          <img className={styles.plus} src={plus} /> Add New
        </button>
        <div className={styles.modalFooter}>
          <div
            className={styles.datePickerSection}
            onClick={(e) => e.stopPropagation()}
          >
            <DatePicker
              className={styles.datepick}
              selected={task.dueDate ? new Date(task.dueDate) : null}
              onChange={handleDateChange}
              dateFormat="dd/MM/yyyy"
              placeholderText="Select Due Date"
              popperClassName={styles.centeredDatepicker}
              popperPlacement="top"
            />
          </div>

          <div className={styles.buttonContainer}>
            <button className={styles.saveButton} onClick={handleSave}>
              Save
            </button>
            <button className={styles.cancelButton} onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
