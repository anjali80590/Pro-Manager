
import React, { Children } from 'react';
import { Outlet } from 'react-router-dom';
import SideBar from '../SideBar/SideBar'
import styles from './Dashboard.module.css';

function Dashboard() {
  return (
    <div className={styles.dashboard}>
      <SideBar />
      <main className={styles.mainContent}>
      {<Outlet/>}

      </main>
    </div>
  );
}
export default Dashboard;