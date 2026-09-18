import { useState, useEffect } from "react";
import {
  Wind,
  LogOut,
  User,
  Mail,
  Calendar,
  Shield,
  Activity,
  Settings,
  UserCog,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [serverStatus, setServerStatus] = useState("checking"); // checking | online | offline
  const [currentTime, setCurrentTime] = useState(new Date());

  // Load user from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("cyclonex_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("cyclonex_user");
        navigate("/auth");
      }
    } else {
      navigate("/auth");
    }
  }, [navigate]);

  // Check backend server status
  useEffect(() => {
    const checkServer = async () => {
      try {
        const res = await fetch("http://localhost:5000/");
        if (res.ok) {
          setServerStatus("online");
        } else {
          setServerStatus("offline");
        }
      } catch {
        setServerStatus("offline");
      }
    };
    checkServer();

    const interval = setInterval(checkServer, 30000);
    return () => clearInterval(interval);
  }, []);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("cyclonex_user");
    navigate("/");
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!user) return null;

  return (
    <div className="dashboard-page">
      {/* HEADER */}
      <header className="dash-header">
        <Link to="/" className="nav-logo">
          <div className="logo-icon">
            <Wind size={22} />
          </div>
          <div>
            <span>Cyclone</span>
            <span className="logo-x">X</span>
          </div>
        </Link>

        <div className="dash-user">
          <div className="dash-time">
            <Clock size={14} />
            <span>{formatTime(currentTime)}</span>
          </div>
          <div
            className={`server-indicator ${serverStatus}`}
          >
            <span className="server-dot"></span>
            {serverStatus === "checking"
              ? "CHECKING"
              : serverStatus === "online"
              ? "SYSTEM ONLINE"
              : "SYSTEM OFFLINE"}
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={16} />
            Exit
          </button>
        </div>
      </header>

      <main className="dash-content">
        {/* WELCOME SECTION */}
        <section className="welcome-section">
          <div className="welcome-avatar">
            <span>{getInitials(user.fullName)}</span>
          </div>
          <div className="welcome-text">
            <p className="welcome-greeting">{getGreeting()},</p>
            <h1 className="welcome-name">{user.fullName}</h1>
            <p className="welcome-date">{formatDate(currentTime)}</p>
          </div>
        </section>

        {/* STATS STRIP */}
        <section className="stats-strip">
          <div className="stat-item">
            <Shield size={18} />
            <div>
              <span className="stat-label">ACCOUNT STATUS</span>
              <strong>Active</strong>
            </div>
          </div>
          <div className="stat-item">
            <Activity size={18} />
            <div>
              <span className="stat-label">SESSION</span>
              <strong>Authenticated</strong>
            </div>
          </div>
          <div className="stat-item">
            <Zap size={18} />
            <div>
              <span className="stat-label">BACKEND</span>
              <strong className={serverStatus === "online" ? "status-online" : "status-offline"}>
                {serverStatus === "online" ? "Connected" : serverStatus === "checking" ? "Checking..." : "Disconnected"}
              </strong>
            </div>
          </div>
        </section>

        {/* MAIN GRID */}
        <div className="dash-grid">
          {/* PROFILE CARD */}
          <div className="dash-card profile-card">
            <div className="card-header">
              <User size={18} />
              <span>USER PROFILE</span>
            </div>
            <div className="profile-info">
              <div className="profile-avatar-large">
                <span>{getInitials(user.fullName)}</span>
              </div>
              <h3>{user.fullName}</h3>
              <p className="profile-role">CycloneX Operator</p>
            </div>
            <div className="profile-details">
              <div className="detail-row">
                <Mail size={15} />
                <span>{user.email}</span>
              </div>
              <div className="detail-row">
                <Shield size={15} />
                <span>Standard Access</span>
              </div>
              <div className="detail-row">
                <Calendar size={15} />
                <span>Member since {new Date().getFullYear()}</span>
              </div>
            </div>
          </div>

          {/* SYSTEM STATUS CARD */}
          <div className="dash-card system-card">
            <div className="card-header">
              <Activity size={18} />
              <span>SYSTEM STATUS</span>
            </div>
            <div className="system-checks">
              <div className="check-row">
                <div className={`check-icon ${serverStatus === "online" ? "check-pass" : "check-fail"}`}>
                  {serverStatus === "online" ? <CheckCircle size={16} /> : <XCircle size={16} />}
                </div>
                <div>
                  <strong>Backend Server</strong>
                  <span>localhost:5000</span>
                </div>
                <div className={`check-badge ${serverStatus === "online" ? "badge-pass" : "badge-fail"}`}>
                  {serverStatus === "online" ? "OPERATIONAL" : serverStatus === "checking" ? "CHECKING" : "DOWN"}
                </div>
              </div>
              <div className="check-row">
                <div className="check-icon check-pass">
                  <CheckCircle size={16} />
                </div>
                <div>
                  <strong>Authentication</strong>
                  <span>Session active</span>
                </div>
                <div className="check-badge badge-pass">VERIFIED</div>
              </div>
              <div className="check-row">
                <div className={`check-icon ${serverStatus === "online" ? "check-pass" : "check-fail"}`}>
                  {serverStatus === "online" ? <CheckCircle size={16} /> : <XCircle size={16} />}
                </div>
                <div>
                  <strong>Database</strong>
                  <span>MongoDB — Cyclone</span>
                </div>
                <div className={`check-badge ${serverStatus === "online" ? "badge-pass" : "badge-fail"}`}>
                  {serverStatus === "online" ? "CONNECTED" : "UNKNOWN"}
                </div>
              </div>
            </div>
          </div>

          {/* QUICK ACTIONS CARD */}
          <div className="dash-card actions-card">
            <div className="card-header">
              <Settings size={18} />
              <span>QUICK ACTIONS</span>
            </div>
            <div className="actions-list">
              <button className="action-btn" onClick={handleLogout}>
                <LogOut size={18} />
                <div>
                  <strong>Logout</strong>
                  <span>End current session</span>
                </div>
              </button>
              <button className="action-btn disabled" disabled>
                <UserCog size={18} />
                <div>
                  <strong>Edit Profile</strong>
                  <span>Coming soon</span>
                </div>
              </button>
              <button className="action-btn disabled" disabled>
                <Settings size={18} />
                <div>
                  <strong>Settings</strong>
                  <span>Coming soon</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;