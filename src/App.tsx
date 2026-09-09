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

type View = 'overview' | 'students' | 'results'

const seedStudents: Student[] = [
  { id: 'STU-1024', name: 'Amara Okafor', admissionNo: 'SD-2024-018', className: 'Grade 10A', gender: 'Female', dob: '2009-04-18', guardian: 'Chinedu Okafor', phone: '+234 803 441 8021', address: '14 Palm Avenue, Ikeja', admitted: '2024-09-02', status: 'Active', results: [{ subject: 'Mathematics', score: 88, grade: 'A' }, { subject: 'English Language', score: 91, grade: 'A' }, { subject: 'Biology', score: 84, grade: 'A' }, { subject: 'History', score: 76, grade: 'B' }] },
  { id: 'STU-1023', name: 'Daniel Mensah', admissionNo: 'SD-2024-017', className: 'Grade 10A', gender: 'Male', dob: '2009-11-02', guardian: 'Kwame Mensah', phone: '+234 809 115 4002', address: '8 Unity Close, Yaba', admitted: '2024-09-02', status: 'Active', results: [{ subject: 'Mathematics', score: 79, grade: 'B' }, { subject: 'English Language', score: 82, grade: 'A' }, { subject: 'Biology', score: 74, grade: 'B' }, { subject: 'History', score: 88, grade: 'A' }] },
  { id: 'STU-1022', name: 'Zainab Bello', admissionNo: 'SD-2024-016', className: 'Grade 9B', gender: 'Female', dob: '2010-06-25', guardian: 'Aisha Bello', phone: '+234 807 224 1931', address: '2 Creek Road, Surulere', admitted: '2024-08-30', status: 'Active', results: [{ subject: 'Mathematics', score: 94, grade: 'A' }, { subject: 'English Language', score: 87, grade: 'A' }, { subject: 'Biology', score: 90, grade: 'A' }, { subject: 'History', score: 92, grade: 'A' }] },
  { id: 'STU-1021', name: 'Tomi Adeyemi', admissionNo: 'SD-2024-015', className: 'Grade 8C', gender: 'Male', dob: '2011-01-14', guardian: 'Bola Adeyemi', phone: '+234 812 548 9120', address: '51 Akin Street, Surulere', admitted: '2024-08-29', status: 'Active', results: [{ subject: 'Mathematics', score: 71, grade: 'B' }, { subject: 'English Language', score: 68, grade: 'C' }, { subject: 'Biology', score: 73, grade: 'B' }, { subject: 'History', score: 80, grade: 'A' }] },
  { id: 'STU-1020', name: 'Ifeoma Nwosu', admissionNo: 'SD-2024-014', className: 'Grade 11B', gender: 'Female', dob: '2008-09-07', guardian: 'Emeka Nwosu', phone: '+234 816 100 8202', address: '22 Garden Estate, GRA', admitted: '2024-08-27', status: 'Active', results: [{ subject: 'Mathematics', score: 89, grade: 'A' }, { subject: 'English Language', score: 93, grade: 'A' }, { subject: 'Biology', score: 86, grade: 'A' }, { subject: 'History', score: 90, grade: 'A' }] },
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
  const [form, setForm] = useState({ name: '', admissionNo: '', className: 'Grade 9A', gender: 'Female', dob: '', guardian: '', phone: '', address: '', math: '', english: '', science: '', history: '' })

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
    const newStudent: Student = { id: `STU-${1000 + students.length + 1}`, name: form.name, admissionNo: form.admissionNo, className: form.className, gender: form.gender as Student['gender'], dob: form.dob, guardian: form.guardian, phone: form.phone, address: form.address, admitted: new Date().toISOString().slice(0, 10), status: 'Active', results }
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
          <button className={view === 'students' ? 'nav-item active' : 'nav-item'} onClick={() => nav('students')}><span className="nav-icon">◎</span> Student register <span className="nav-count">{activeCount}</span></button>
          <button className={view === 'results' ? 'nav-item active' : 'nav-item'} onClick={() => nav('results')}><span className="nav-icon">▤</span> Examination results</button>
        </nav>
        <div className="sidebar-bottom"><div className="help-card"><span className="help-icon">?</span><strong>Need a hand?</strong><p>Learn how to manage your school records.</p><button>View guide <span>→</span></button></div><div className="profile"><div className="avatar avatar-dark">MO</div><div><strong>Mrs. Mary Okoye</strong><span>Administrator</span></div><button className="more">•••</button></div></div>
      </aside>
      <main className="main-content">
        <header className="topbar"><div className="breadcrumb"><span>Greenfield Academy</span><b>/</b><strong>{view === 'overview' ? 'Overview' : view === 'students' ? 'Student register' : 'Examination results'}</strong></div><div className="top-actions"><button className="icon-button" aria-label="Notifications">♧<i /></button><div className="top-avatar">MO</div></div></header>
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
    <section className="welcome-row"><div><p className="eyebrow">Wednesday, September 11, 2024</p><h1>Good morning, Mary <span>✦</span></h1><p className="subtext">Here is what is happening across your school today.</p></div><button className="primary-button" onClick={onAdd}><span>+</span> Admit a student</button></section>
    <section className="stat-grid"><Stat label="Total students" value={activeCount.toString()} detail="+8.4%" note="vs last term" accent="green" icon="◎" /><Stat label="Average performance" value={`${average}%`} detail="+3.2%" note="vs last term" accent="blue" icon="⌁" /><Stat label="Classes running" value="18" detail="This academic year" note="2024 / 2025" accent="amber" icon="▦" /></section>
    <section className="content-grid"><div className="panel recent-panel"><div className="panel-heading"><div><h2>Recent admissions</h2><p>The latest students added to your register.</p></div><button className="text-button" onClick={onStudents}>View all <span>→</span></button></div><div className="student-list">{students.slice(0, 5).map((student) => <button className="student-row" key={student.id} onClick={() => onSelect(student)}><div className={`avatar avatar-${student.gender === 'Female' ? 'coral' : 'blue'}`}>{initials(student.name)}</div><div className="student-main"><strong>{student.name}</strong><span>{student.admissionNo} · {student.className}</span></div><div className="student-date">{new Date(student.admitted).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}<span>↗</span></div></button>)}</div></div><div className="panel class-panel"><div className="panel-heading"><div><h2>Class snapshot</h2><p>Students by year group.</p></div><button className="small-menu">•••</button></div><div className="class-bars"><ClassBar name="Grade 7" count={28} total={40} color="coral" /><ClassBar name="Grade 8" count={34} total={40} color="yellow" /><ClassBar name="Grade 9" count={31} total={40} color="blue" /><ClassBar name="Grade 10" count={26} total={40} color="green" /></div><div className="class-footer"><span><i className="legend-dot coral" /> 119 enrolled</span><span>Capacity 160</span></div></div></section>
    <section className="quick-strip"><div><div className="quick-icon">↗</div><div><strong>Keep your register up to date</strong><p>Add new admissions as they arrive so your class lists and results stay accurate.</p></div></div><button onClick={onAdd}>Add student <span>→</span></button></section>
  </>
}

function Stat({ label, value, detail, note, accent, icon }: { label: string; value: string; detail: string; note: string; accent: string; icon: string }) { return <div className="stat-card"><div className={`stat-icon ${accent}`}>{icon}</div><div className="stat-label">{label}</div><div className="stat-value">{value}</div><div className="stat-detail"><span>{detail}</span> {note}</div></div> }
function ClassBar({ name, count, total, color }: { name: string; count: number; total: number; color: string }) { return <div className="class-bar"><div><strong>{name}</strong><span>{count} students</span></div><div className="bar-track"><i className={color} style={{ width: `${count / total * 100}%` }} /></div></div> }

function StudentsView({ students, query, setQuery, onAdd, onSelect }: { students: Student[]; query: string; setQuery: (value: string) => void; onAdd: () => void; onSelect: (student: Student) => void }) {
  return <><section className="view-heading"><div><p className="eyebrow">Student records</p><h1>Student register</h1><p className="subtext">Every admitted student, one reliable record.</p></div><button className="primary-button" onClick={onAdd}><span>+</span> Admit a student</button></section><div className="toolbar"><div className="search-box"><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, ID or class" /></div><button className="filter-button">Filter <span>⌄</span></button><button className="filter-button">Export <span>↓</span></button></div><div className="panel table-panel"><div className="table-head"><span>Student</span><span>Admission no.</span><span>Class</span><span>Average</span><span>Status</span><span /></div>{students.map((student) => <button className="table-row" key={student.id} onClick={() => onSelect(student)}><div className="table-student"><div className={`avatar avatar-${student.gender === 'Female' ? 'coral' : 'blue'}`}>{initials(student.name)}</div><div><strong>{student.name}</strong><span>{student.gender} · {student.id}</span></div></div><span>{student.admissionNo}</span><span>{student.className}</span><span className="average-score">{averageFor(student.results)}%</span><span><em className="active-pill">{student.status}</em></span><span className="row-arrow">→</span></button>)}{students.length === 0 && <div className="empty-state">No student records match your search.</div>}</div><div className="table-footer">Showing {students.length} of {students.length} students <span>Updated just now</span></div></>
}

function ResultsView({ students, onSelect }: { students: Student[]; onSelect: (student: Student) => void }) { return <><section className="view-heading"><div><p className="eyebrow">Academic performance</p><h1>Examination results</h1><p className="subtext">Review performance across your student body.</p></div><button className="filter-button">2024 / 2025 <span>⌄</span></button></section><div className="results-summary"><div><span>Students assessed</span><strong>{students.filter((student) => student.results.length > 0).length}</strong></div><div><span>School average</span><strong>{Math.round(students.reduce((sum, student) => sum + averageFor(student.results), 0) / students.length)}%</strong></div><div><span>Top performer</span><strong>{students.slice().sort((a, b) => averageFor(b.results) - averageFor(a.results))[0]?.name}</strong></div></div><div className="panel table-panel"><div className="table-head results-head"><span>Student</span><span>Class</span><span>Mathematics</span><span>English</span><span>Overall</span><span /></div>{students.map((student) => <button className="table-row" key={student.id} onClick={() => onSelect(student)}><div className="table-student"><div className={`avatar avatar-${student.gender === 'Female' ? 'coral' : 'blue'}`}>{initials(student.name)}</div><div><strong>{student.name}</strong><span>{student.admissionNo}</span></div></div><span>{student.className}</span><span className="result-mark">{student.results[0]?.score ?? '-'} <small>{student.results[0]?.grade}</small></span><span className="result-mark">{student.results[1]?.score ?? '-'} <small>{student.results[1]?.grade}</small></span><span className="average-score">{averageFor(student.results)}%</span><span className="row-arrow">→</span></button>)}</div></> }

function StudentDrawer({ student, onClose }: { student: Student; onClose: () => void }) { return <div className="drawer-backdrop" onClick={onClose}><aside className="drawer" onClick={(event) => event.stopPropagation()}><button className="drawer-close" onClick={onClose}>×</button><div className="drawer-top"><div className={`large-avatar avatar-${student.gender === 'Female' ? 'coral' : 'blue'}`}>{initials(student.name)}</div><p className="eyebrow">{student.admissionNo}</p><h2>{student.name}</h2><span className="class-tag">{student.className} · {student.status}</span></div><div className="drawer-section"><h3>Student information</h3><Info label="Date of birth" value={new Date(student.dob).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })} /><Info label="Guardian" value={student.guardian} /><Info label="Phone" value={student.phone} /><Info label="Address" value={student.address} /></div><div className="drawer-section"><div className="section-title"><h3>Examination results</h3><strong>{averageFor(student.results)}% average</strong></div>{student.results.map((result) => <div className="result-line" key={result.subject}><span>{result.subject}</span><b>{result.score}</b><em>{result.grade}</em></div>)}{student.results.length === 0 && <p className="muted">No results entered yet.</p>}</div></aside></div> }
function Info({ label, value }: { label: string; value: string }) { return <div className="info-line"><span>{label}</span><strong>{value || 'Not provided'}</strong></div> }

function StudentForm({ form, setForm, onClose, onSubmit }: { form: Record<string, string>; setForm: (form: Record<string, string>) => void; onClose: () => void; onSubmit: (event: FormEvent) => void }) { const update = (key: string, value: string) => setForm({ ...form, [key]: value }); return <div className="modal-backdrop" onClick={onClose}><form className="modal" onClick={(event) => event.stopPropagation()} onSubmit={onSubmit}><div className="modal-header"><div><p className="eyebrow">New admission</p><h2>Admit a student</h2></div><button type="button" className="drawer-close" onClick={onClose}>×</button></div><div className="form-grid"><label>Full name<input required value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="e.g. Ada Lovelace" /></label><label>Admission number<input required value={form.admissionNo} onChange={(event) => update('admissionNo', event.target.value)} /></label><label>Class<select value={form.className} onChange={(event) => update('className', event.target.value)}><option>Grade 7A</option><option>Grade 8B</option><option>Grade 9A</option><option>Grade 10A</option><option>Grade 11B</option></select></label><label>Gender<select value={form.gender} onChange={(event) => update('gender', event.target.value)}><option>Female</option><option>Male</option></select></label><label>Date of birth<input required type="date" value={form.dob} onChange={(event) => update('dob', event.target.value)} /></label><label>Parent / guardian<input required value={form.guardian} onChange={(event) => update('guardian', event.target.value)} placeholder="Full name" /></label><label>Phone number<input required value={form.phone} onChange={(event) => update('phone', event.target.value)} placeholder="+234 ..." /></label><label>Home address<input required value={form.address} onChange={(event) => update('address', event.target.value)} placeholder="Street and city" /></label></div><div className="form-divider"><span>Initial examination results</span><small>Optional</small></div><div className="scores-grid">{[['math', 'Mathematics'], ['english', 'English'], ['science', 'Science'], ['history', 'History']].map(([key, label]) => <label key={key}>{label}<input type="number" min="0" max="100" value={form[key]} onChange={(event) => update(key, event.target.value)} placeholder="0 - 100" /></label>)}</div><div className="modal-actions"><button type="button" className="secondary-button" onClick={onClose}>Cancel</button><button type="submit" className="primary-button">Save student <span>→</span></button></div></form></div> }

export default App
