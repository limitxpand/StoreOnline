import Header from '@/components/Header/Header';
import Sidebar from '@/components/Sidebar/Sidebar';
import styles from './storeLayout.module.css';

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.page}>
      <Header />
      <main className="container" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="global-main-layout" style={{ flex: 1, width: '100%' }}>
          <Sidebar />
          <div className="global-content-area" style={{ flex: 1, width: '100%' }}>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
