import { FormEvent, useEffect, useMemo, useState } from 'react'

type Result = { subject: string; score: number; grade: string }
type Student = {
  id: string
  name: string
  admissionNo: string
  className: string
  gender: 'Female' | 'Male'
  dob: string
  guardian: string
  phone: string
  address: string
  admitted: string
  status: 'Active' | 'Alumni'
  results: Result[]
}

type FormState = {
  name: string
  admissionNo: string
  className: string
  gender: string
  dob: string
  guardian: string
  phone: string
  address: string
  math: string
  english: string
  science: string
  history: string
}

type View = 'overview' | 'students' | 'results'

const seedStudents: Student[] = [
  { id: 'STU-1024', name: 'Amara Okafor', admissionNo: 'SD-2024-018', className: 'Grade 10A', gender: 'Female', dob: '2009-04-18', guardian: 'Chinedu Okafor', phone: '+234 803 441 8021', address: '45 Lekki Phase 1, Lagos', admitted: '2024-01-15', status: 'Active', results: [{ subject: 'Mathematics', score: 92, grade: 'A' }, { subject: 'English Language', score: 88, grade: 'A' }, { subject: 'Science', score: 85, grade: 'A' }, { subject: 'History', score: 78, grade: 'B' }] },
  { id: 'STU-1023', name: 'Daniel Mensah', admissionNo: 'SD-2024-017', className: 'Grade 10A', gender: 'Male', dob: '2009-11-02', guardian: 'Kwame Mensah', phone: '+234 809 115 4002', address: '8 Independence Avenue, Accra', admitted: '2024-01-16', status: 'Active', results: [{ subject: 'Mathematics', score: 76, grade: 'B' }, { subject: 'English Language', score: 82, grade: 'A' }, { subject: 'Science', score: 79, grade: 'B' }, { subject: 'History', score: 71, grade: 'B' }] },
  { id: 'STU-1022', name: 'Zainab Bello', admissionNo: 'SD-2024-016', className: 'Grade 9B', gender: 'Female', dob: '2010-06-25', guardian: 'Aisha Bello', phone: '+234 807 224 1931', address: '2 Cloisters Road, Victoria Island', admitted: '2024-02-10', status: 'Active', results: [{ subject: 'Mathematics', score: 88, grade: 'A' }, { subject: 'English Language', score: 90, grade: 'A' }, { subject: 'Science', score: 86, grade: 'A' }] },
  { id: 'STU-1021', name: 'Tomi Adeyemi', admissionNo: 'SD-2024-015', className: 'Grade 8C', gender: 'Male', dob: '2011-01-14', guardian: 'Bola Adeyemi', phone: '+234 812 548 9120', address: '51 Awolowo Road, Ikoyi', admitted: '2024-02-20', status: 'Active', results: [{ subject: 'Mathematics', score: 72, grade: 'B' }, { subject: 'Science', score: 75, grade: 'B' }] },
  { id: 'STU-1020', name: 'Ifeoma Nwosu', admissionNo: 'SD-2024-014', className: 'Grade 11B', gender: 'Female', dob: '2008-09-07', guardian: 'Emeka Nwosu', phone: '+234 816 100 8202', address: '22 Muri Okunola Street, Yaba', admitted: '2024-01-08', status: 'Active', results: [{ subject: 'Mathematics', score: 95, grade: 'A' }, { subject: 'English Language', score: 92, grade: 'A' }, { subject: 'Science', score: 94, grade: 'A' }, { subject: 'History', score: 89, grade: 'A' }] },
]

const gradeFor = (score: number) => score >= 85 ? 'A' : score >= 70 ? 'B' : score >= 55 ? 'C' : score >= 45 ? 'D' : 'F'
const averageFor = (results: Result[]) => results.length ? Math.round(results.reduce((sum, result) => sum + result.score, 0) / results.length) : 0
const initials = (name: string) => name.split(' ').map((part) => part[0]).join('').slice(0, 2)

function App() {
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem('schooldesk-students')
    return saved ? JSON.parse(saved) : seedStudents
  })
  const [view, setView] = useState<View>('overview')
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<Student | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [toast, setToast] = useState('')
  const [form, setForm] = useState<FormState>({ name: '', admissionNo: '', className: 'Grade 9A', gender: 'Female', dob: '', guardian: '', phone: '', address: '', math: '', english: '', science: '', history: '' })

  useEffect(() => { localStorage.setItem('schooldesk-students', JSON.stringify(students)) }, [students])
  useEffect(() => { if (toast) { const timer = window.setTimeout(() => setToast(''), 2800); return () => window.clearTimeout(timer) } }, [toast])

  const filteredStudents = useMemo(() => students.filter((student) => `${student.name} ${student.admissionNo} ${student.className}`.toLowerCase().includes(query.toLowerCase())), [students, query])
  const activeCount = students.filter((student) => student.status === 'Active').length
  const average = students.length ? Math.round(students.reduce((sum, student) => sum + averageFor(student.results), 0) / students.length) : 0

  const openForm = () => {
    setForm({ name: '', admissionNo: `SD-2025-${String(students.length + 1).padStart(3, '0')}`, className: 'Grade 9A', gender: 'Female', dob: '', guardian: '', phone: '', address: '', math: '', english: '', science: '', history: '' })
    setShowForm(true)
  }

  const addStudent = (event: FormEvent) => {
    event.preventDefault()
    const subjects = [['Mathematics', form.math], ['English Language', form.english], ['Science', form.science], ['History', form.history]]
    const results = subjects.filter(([, score]) => score !== '').map(([subject, score]) => ({ subject, score: Number(score), grade: gradeFor(Number(score)) }))
    const newStudent: Student = { id: `STU-${1000 + students.length + 1}`, name: form.name, admissionNo: form.admissionNo, className: form.className, gender: form.gender as Student['gender'], dob: form.dob, guardian: form.guardian, phone: form.phone, address: form.address, admitted: new Date().toISOString().split('T')[0], status: 'Active', results }
    setStudents((current) => [newStudent, ...current])
    setShowForm(false)
    setToast(`${newStudent.name} was added to the register`)
  }

  const nav = (nextView: View) => { setView(nextView); setSelected(null) }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand"><img className="brand-logo" src="/logo.png" alt="New Testament Baptist Academy logo" /><div><strong>SchoolDesk</strong><span>Records office</span></div></div>
        <div className="school-pill"><span className="status-dot" /> Greenfield Academy <span className="chevron">⌄</span></div>
        <nav className="main-nav" aria-label="Main navigation">
          <button className={view === 'overview' ? 'nav-item active' : 'nav-item'} onClick={() => nav('overview')}><span className="nav-icon">◈</span> Overview</button>
          <button className={view === 'students' ? 'nav-item active' : 'nav-item'} onClick={() => nav('students')}><span className="nav-icon">◎</span> Student register <span className="nav-count">{students.length}</span></button>
          <button className={view === 'results' ? 'nav-item active' : 'nav-item'} onClick={() => nav('results')}><span className="nav-icon">▤</span> Examination results</button>
        </nav>
        <div className="sidebar-bottom"><div className="help-card"><span className="help-icon">?</span><strong>Need a hand?</strong><p>Learn how to manage your school records.</p><button>View guide</button></div></div>
      </aside>
      <main className="main-content">
        <header className="topbar"><div className="breadcrumb"><span>Greenfield Academy</span><b>/</b><strong>{view === 'overview' ? 'Overview' : view === 'students' ? 'Student register' : 'Examination results'}</strong></div></header>
        <div className="page-wrap">
          {view === 'overview' && <Overview students={students} activeCount={activeCount} average={average} onAdd={openForm} onStudents={() => nav('students')} onSelect={setSelected} />}
          {view === 'students' && <StudentsView students={filteredStudents} query={query} setQuery={setQuery} onAdd={openForm} onSelect={setSelected} />}
          {view === 'results' && <ResultsView students={students} onSelect={setSelected} />}
        </div>
      </main>
      {selected && <StudentDrawer student={selected} onClose={() => setSelected(null)} />}
      {showForm && <StudentForm form={form} setForm={setForm} onClose={() => setShowForm(false)} onSubmit={addStudent} />}
      {toast && <div className="toast"><span>✓</span>{toast}</div>}
    </div>
  )
}

function Overview({ students, activeCount, average, onAdd, onStudents, onSelect }: { students: Student[]; activeCount: number; average: number; onAdd: () => void; onStudents: () => void; onSelect: (student: Student) => void }) {
  return <>
    <section className="welcome-row"><div><p className="eyebrow">Wednesday, September 11, 2024</p><h1>Good morning, Mary <span>✦</span></h1><p className="subtext">Here is what is happening across your school.</p></div><button className="cta-button" onClick={onAdd}>+ New admission</button></section>
    <section className="stat-grid"><Stat label="Total students" value={activeCount.toString()} detail="+8.4%" note="vs last term" accent="green" icon="◎" /><Stat label="Average performance" value={`${average}%`} detail="+5.2%" note="vs last term" accent="blue" icon="▤" /><Stat label="Total classes" value="12" detail="+1" note="new class" accent="purple" icon="◈" /></section>
    <section className="content-grid"><div className="panel recent-panel"><div className="panel-heading"><div><h2>Recent admissions</h2><p>The latest students added to your register.</p></div><button onClick={onStudents}>View all</button></div><div className="panel-content"><div className="student-list">{students.slice(0, 5).map((student) => <div key={student.id} className="student-row" onClick={() => onSelect(student)}><div className="student-avatar">{initials(student.name)}</div><div><strong>{student.name}</strong><span>{student.className}</span></div><span className="admission-badge">{student.admissionNo}</span></div>)}</div></div></div><div className="panel"><div className="panel-heading"><h3>Class distribution</h3></div><div className="panel-content class-dist"><ClassBar name="Grade 11B" count={students.filter((s) => s.className === 'Grade 11B').length} total={students.length} color="hsl(48, 100%, 50%)" /><ClassBar name="Grade 10A" count={students.filter((s) => s.className === 'Grade 10A').length} total={students.length} color="hsl(100, 70%, 50%)" /><ClassBar name="Grade 9B" count={students.filter((s) => s.className === 'Grade 9B').length} total={students.length} color="hsl(250, 100%, 50%)" /><ClassBar name="Grade 8C" count={students.filter((s) => s.className === 'Grade 8C').length} total={students.length} color="hsl(12, 100%, 50%)" /></div></div></section>
    <section className="quick-strip"><div><div className="quick-icon">↗</div><div><strong>Keep your register up to date</strong><p>Add new admissions as they arrive so your class lists and results are always current.</p></div></div></section>
  </>
}

function Stat({ label, value, detail, note, accent, icon }: { label: string; value: string; detail: string; note: string; accent: string; icon: string }) { return <div className="stat-card"><div className="stat-top"><span className="stat-icon" style={{ color: accent }}>{icon}</span><div><strong>{value}</strong><span>{detail}</span></div></div><p>{label} <em>{note}</em></p></div> }
function ClassBar({ name, count, total, color }: { name: string; count: number; total: number; color: string }) { return <div className="class-bar"><div><strong>{name}</strong><span>{count} students</span></div><div className="bar"><div className="fill" style={{ width: `${(count / total) * 100}%`, backgroundColor: color }}></div></div></div> }

function StudentsView({ students, query, setQuery, onAdd, onSelect }: { students: Student[]; query: string; setQuery: (value: string) => void; onAdd: () => void; onSelect: (student: Student) => void }) {
  return <><section className="view-heading"><div><p className="eyebrow">Student records</p><h1>Student register</h1><p className="subtext">Every admitted student, one reliable record.</p></div><div className="search-bar"><input type="text" placeholder="Search by name, admission number, or class..." value={query} onChange={(e) => setQuery(e.target.value)} /><span>🔍</span></div><button className="cta-button" onClick={onAdd}>+ New admission</button></section><section className="content-grid full"><div className="panel"><div className="panel-content"><table className="students-table"><thead><tr><th>Name</th><th>Admission No</th><th>Class</th><th>Guardian</th><th>Phone</th><th>Status</th></tr></thead><tbody>{students.map((student) => <tr key={student.id} onClick={() => onSelect(student)} style={{ cursor: 'pointer' }}><td><strong>{student.name}</strong></td><td>{student.admissionNo}</td><td>{student.className}</td><td>{student.guardian}</td><td>{student.phone}</td><td><span className="status" style={{ backgroundColor: student.status === 'Active' ? '#10b981' : '#9ca3af' }}>{student.status}</span></td></tr>)}</tbody></table></div></div></section></>
}

function ResultsView({ students, onSelect }: { students: Student[]; onSelect: (student: Student) => void }) { return <><section className="view-heading"><div><p className="eyebrow">Academic performance</p><h1>Examination results</h1><p className="subtext">Student scores and performance overview.</p></div></section><section className="content-grid full"><div className="panel"><div className="panel-content"><table className="students-table"><thead><tr><th>Student</th><th>Class</th><th>Average</th><th>Best Subject</th><th>View</th></tr></thead><tbody>{students.filter((student) => student.results.length > 0).map((student) => { const avg = averageFor(student.results); const best = student.results.reduce((prev, current) => current.score > prev.score ? current : prev); return <tr key={student.id}><td><strong>{student.name}</strong></td><td>{student.className}</td><td><strong>{avg}%</strong></td><td>{best.subject} ({best.score}%)</td><td><button onClick={() => onSelect(student)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#0066cc' }}>→</button></td></tr> })}</tbody></table></div></div></section></>
}

function StudentDrawer({ student, onClose }: { student: Student; onClose: () => void }) { return <div className="drawer-backdrop" onClick={onClose}><aside className="drawer" onClick={(event) => event.stopPropagation()}><div className="drawer-header"><h2>{student.name}</h2><button onClick={onClose}>✕</button></div><div className="drawer-content"><div className="drawer-section"><h3>Student Info</h3><Info label="Admission No" value={student.admissionNo} /><Info label="ID" value={student.id} /><Info label="Gender" value={student.gender} /><Info label="Date of Birth" value={student.dob} /><Info label="Admitted" value={student.admitted} /><Info label="Status" value={student.status} /></div><div className="drawer-section"><h3>Guardian Info</h3><Info label="Guardian" value={student.guardian} /><Info label="Phone" value={student.phone} /><Info label="Address" value={student.address} /></div>{student.results.length > 0 && <div className="drawer-section"><h3>Results</h3><div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>{student.results.map((result, idx) => <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}><span>{result.subject}</span><strong>{result.score}% ({result.grade})</strong></div>)}</div></div>}</div></aside></div> }
function Info({ label, value }: { label: string; value: string }) { return <div className="info-line"><span>{label}</span><strong>{value || 'Not provided'}</strong></div> }

function StudentForm({ form, setForm, onClose, onSubmit }: { form: FormState; setForm: (form: FormState) => void; onClose: () => void; onSubmit: (event: FormEvent) => void }) {
  return <div className="modal-backdrop" onClick={onClose}><div className="modal" onClick={(e) => e.stopPropagation()}><div className="modal-header"><h2>Add new student</h2><button onClick={onClose}>✕</button></div><form onSubmit={onSubmit} className="modal-content"><div className="form-group"><label>Full Name *</label><input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}><div className="form-group"><label>Admission No *</label><input type="text" required value={form.admissionNo} onChange={(e) => setForm({ ...form, admissionNo: e.target.value })} readOnly style={{ backgroundColor: '#f3f4f6' }} /></div><div className="form-group"><label>Class *</label><select value={form.className} onChange={(e) => setForm({ ...form, className: e.target.value })}><option>Grade 8A</option><option>Grade 8B</option><option>Grade 8C</option><option>Grade 9A</option><option>Grade 9B</option><option>Grade 10A</option><option>Grade 10B</option><option>Grade 11A</option><option>Grade 11B</option></select></div></div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}><div className="form-group"><label>Gender *</label><select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}><option>Female</option><option>Male</option></select></div><div className="form-group"><label>Date of Birth *</label><input type="date" required value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} /></div></div><div className="form-group"><label>Guardian Name *</label><input type="text" required value={form.guardian} onChange={(e) => setForm({ ...form, guardian: e.target.value })} /></div><div className="form-group"><label>Phone Number *</label><input type="tel" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div><div className="form-group"><label>Address</label><input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div><div><h3 style={{ marginTop: '24px', marginBottom: '12px' }}>Academic Results (Optional)</h3><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}><div className="form-group"><label>Mathematics</label><input type="number" min="0" max="100" value={form.math} onChange={(e) => setForm({ ...form, math: e.target.value })} placeholder="Score (0-100)" /></div><div className="form-group"><label>English Language</label><input type="number" min="0" max="100" value={form.english} onChange={(e) => setForm({ ...form, english: e.target.value })} placeholder="Score (0-100)" /></div><div className="form-group"><label>Science</label><input type="number" min="0" max="100" value={form.science} onChange={(e) => setForm({ ...form, science: e.target.value })} placeholder="Score (0-100)" /></div><div className="form-group"><label>History</label><input type="number" min="0" max="100" value={form.history} onChange={(e) => setForm({ ...form, history: e.target.value })} placeholder="Score (0-100)" /></div></div></div><div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}><button type="button" onClick={onClose} style={{ padding: '10px 20px', border: '1px solid #d1d5db', borderRadius: '6px', backgroundColor: 'white', cursor: 'pointer' }}>Cancel</button><button type="submit" style={{ padding: '10px 20px', border: 'none', borderRadius: '6px', backgroundColor: '#0066cc', color: 'white', cursor: 'pointer' }}>Add student</button></div></form></div></div>
}

export default App
