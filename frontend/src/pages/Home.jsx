import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Public/Navbar';
import '../css/Home.css';

const Home = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [rollNumber, setRollNumber] = useState('');
  const [student, setStudent] = useState(null);
  const [attendanceList, setAttendanceList] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log("Fetching user data...");
        const response = await fetch('http://localhost:8000/api/auth/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Authentication error:", errorData);
          throw new Error('Authentication failed');
        }

        const userData = await response.json();
        console.log("User data fetched:", userData);
        setUser(userData);
      } catch (err) {
        console.error('Error fetching user data:', err.message);
        setError('Session expired or invalid. Please sign in again.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/home/upload-attendance', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        console.error('Upload error:', data);
        throw new Error(data.detail || `Failed to upload attendance (Status: ${response.status})`);
      }

      setSuccessMessage('Attendance uploaded successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
      setFile(null);
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAttendanceList = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/home/attendance-list', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to fetch attendance list');
      }
      setAttendanceList(data.students || data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (!attendanceList.length) {
      setError('No attendance data to download');
      return;
    }

    const headers = ['name', 'roll_number', 'event_id', 'is_present', 'marked_by', 'marked_at'];
    const csvRows = [
      headers.join(','),
      ...attendanceList.map(row =>
        headers.map(header => `"${(row[header] ?? '').toString().replace(/"/g, '""')}"`).join(',')
      )
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'attendance_list.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleSearchStudent = async (e) => {
    e.preventDefault();
    setError('');
    setStudent(null);
    setSuccessMessage('');

    try {
      const response = await fetch(`http://localhost:8000/api/home/search-student?roll_number=${rollNumber}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Student not found');
      }
      setStudent(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleMarkAttendance = async () => {
    setLoading(true);
    setSuccessMessage('');
    try {
      const response = await fetch('http://localhost:8000/api/home/mark-attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ roll_number: rollNumber }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || 'Failed to mark attendance');
      }
      setSuccessMessage(`${student.name} is marked as present`);
      setTimeout(() => {
        setStudent(null);
        setRollNumber('');
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="home-container">
        <Navbar />
        <div className="home-content">
          <div className="loading">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <Navbar />
      <div className="home-content">
        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        {user && user.role === 'admin' && (
          <div className="admin-section">
            <h2>Admin Dashboard</h2>
            <form onSubmit={handleFileUpload} className="upload-form">
              <input
                type="file"
                accept=".csv"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Uploading...' : 'Upload Attendance'}
              </button>
            </form>

            <div className="attendance-list">
              <h3>Attendance List</h3>
              <button onClick={fetchAttendanceList} disabled={loading}>
                {loading ? 'Loading...' : 'View Attendance List'}
              </button>
              <button onClick={downloadCSV} disabled={loading || !attendanceList.length}>
                Download as CSV
              </button>
              {attendanceList.length > 0 && (
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Roll Number</th>
                      <th>Event ID</th>
                      <th>Present</th>
                      <th>Marked By</th>
                      <th>Marked At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceList.map((record, index) => (
                      <tr key={index}>
                        <td>{record.name}</td>
                        <td>{record.roll_number}</td>
                        <td>{record.event_id}</td>
                        <td>{record.is_present ? 'Yes' : 'No'}</td>
                        <td>{record.marked_by || 'N/A'}</td>
                        <td>{record.marked_at || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {user && user.role === 'volunteer' && (
          <div className="volunteer-section">
            <h2>Volunteer Dashboard</h2>
            <form onSubmit={handleSearchStudent} className="search-form">
              <input
                type="text"
                placeholder="Enter Roll Number"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
              </button>
            </form>

            {student && (
              <div className="student-details">
                <p><strong>Name:</strong> {student.name}</p>
                <p><strong>Roll Number:</strong> {student.roll_number}</p>
                <button onClick={handleMarkAttendance} disabled={loading}>
                  {loading ? 'Marking...' : 'Mark as Present'}
                </button>
                {successMessage && (
                  <div className="success-message">{successMessage}</div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;