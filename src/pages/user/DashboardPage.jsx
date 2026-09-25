import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router";
import { assessmentApi } from "../../api/assessments";
import Loader from "../../components/common/Loader";
import EmptyState from "../../components/common/EmptyState";
import Pagination from "../../components/common/Pagination";
import { FiSearch, FiClock, FiAward, FiArrowRight } from "react-icons/fi";

export default function DashboardPage() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9, sort_by: sortBy, sort_order: sortOrder };
      if (search.trim()) params.search = search.trim();
      if (category) params.category = category;
      if (difficulty) params.difficulty = difficulty;
      const data = await assessmentApi.getAll(params);
      setAssessments(data.items || []);
      setTotalPages(data.total_pages || 1);
    } catch {
      setAssessments([]);
    } finally {
      setLoading(false);
    }
  }, [page, search, category, difficulty, sortBy, sortOrder]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadData();
  };

  return (
    <div className="space-y-6">
      <div className="bg-primary text-white p-6 sm:p-8 rounded-2xl shadow-sm">
        <h1 className="text-2xl sm:text-3xl font-bold">Assessments & Coding Tests</h1>
        <p className="text-white/80 text-sm mt-1">Select an assessment to test your engineering proficiency.</p>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search assessments..."
              className="input input-bordered w-full pl-9 text-sm"
            />
          </div>
          <button type="submit" className="btn btn-primary text-white btn-sm h-10">Search</button>
        </form>

        <div className="flex gap-2">
          <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} className="select select-bordered select-sm text-sm">
            <option value="">All Categories</option>
            <option value="Frontend">Frontend</option>
            <option value="Backend">Backend</option>
            <option value="Python">Python</option>
            <option value="JavaScript">JavaScript</option>
            <option value="Fullstack">Fullstack</option>
          </select>

          <select value={difficulty} onChange={(e) => { setDifficulty(e.target.value); setPage(1); }} className="select select-bordered select-sm text-sm">
            <option value="">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <select value={`${sortBy}-${sortOrder}`} onChange={(e) => { const [s, o] = e.target.value.split("-"); setSortBy(s); setSortOrder(o); setPage(1); }} className="select select-bordered select-sm text-sm">
            <option value="created_at-desc">Newest First</option>
            <option value="created_at-asc">Oldest First</option>
            <option value="total_marks-desc">Highest Marks</option>
            <option value="duration-asc">Shortest Time</option>
          </select>
        </div>
      </div>

      {loading ? (
        <Loader text="Loading assessments..." />
      ) : assessments.length === 0 ? (
        <EmptyState title="No assessments found" message="Try adjusting your search criteria." actionLabel="Clear Search" onAction={() => { setSearch(""); setCategory(""); setDifficulty(""); setPage(1); }} />
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {assessments.map((item) => (
              <div key={item.id} className="bg-white p-5 rounded-2xl border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="badge badge-outline text-xs">{item.category}</span>
                    <span className="badge badge-sm badge-ghost capitalize">{item.difficulty}</span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-base mb-1">{item.title}</h3>
                  <p className="text-slate-500 text-xs line-clamp-2 mb-4">{item.description}</p>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-500 py-2 border-t border-slate-100 mb-3">
                    <span className="flex items-center gap-1"><FiClock /> {item.duration} Mins</span>
                    <span className="flex items-center gap-1"><FiAward /> {item.total_marks} Marks</span>
                  </div>
                  <Link to={`/assessments/${item.id}`} className="btn btn-outline btn-primary btn-sm w-full flex items-center justify-center gap-1">
                    View Details <FiArrowRight />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} hasNext={page < totalPages} hasPrevious={page > 1} />
        </div>
      )}
    </div>
  );
}
