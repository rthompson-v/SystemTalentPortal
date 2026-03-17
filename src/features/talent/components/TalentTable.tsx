import { useNavigate } from 'react-router-dom';
import type { Talent } from '../types';

const ENGLISH_COLORS: Record<string, string> = {
  'A1': 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  'A2': 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  'B1': 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-500 border-yellow-200 dark:border-yellow-900/50',
  'B2': 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/50',
  'C1': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/50',
  'C2': 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/50',
};

const AVATAR_COLORS = [
  'bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400',
  'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
  'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
  'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400',
  'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400',
];

function getInitials(name: string) {
  return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
}

function getAvatarColor(name: string) {
  const idx = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

function getEnglishColor(level: string) {
  const code = level.split(' ')[0]; // e.g. "B2"
  return ENGLISH_COLORS[code] ?? ENGLISH_COLORS['A1'];
}

interface Props {
  talents: Talent[];
  onDelete?: (id: string) => void;
}

export default function TalentTable({ talents, onDelete }: Props) {
  const navigate = useNavigate();

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
      <table className="w-full text-left min-w-[900px]">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50">
            {['Candidate', 'Experience', 'Tech Stack', 'English', 'Location', 'Added', 'Links', ''].map(h => (
              <th
                key={h}
                className="px-4 py-3 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {talents.length === 0 ? (
            <tr>
              <td colSpan={8} className="px-4 py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
                No candidates found.
              </td>
            </tr>
          ) : (
            talents.map(talent => (
              <tr
                key={talent.id}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors group"
              >
                {/* Candidate */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div
                      className={`size-10 rounded-full flex items-center justify-center font-bold text-sm ${getAvatarColor(talent.fullName)}`}
                    >
                      {getInitials(talent.fullName)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">{talent.fullName}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{talent.email}</p>
                    </div>
                  </div>
                </td>

                {/* Experience */}
                <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                  {talent.yearsOfExperience} yr{talent.yearsOfExperience !== 1 ? 's' : ''}
                </td>

                {/* Tech Stack */}
                <td className="px-4 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {talent.techStack.split(',').slice(0, 3).map(tech => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-xs font-medium border border-slate-200 dark:border-slate-700"
                      >
                        {tech.trim()}
                      </span>
                    ))}
                  </div>
                </td>

                {/* English */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getEnglishColor(talent.englishLevel)}`}>
                    {talent.englishLevel}
                  </span>
                </td>

                {/* Location */}
                <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-400">
                  {talent.location}
                </td>

                {/* Added */}
                <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-500 italic">
                  {new Date(talent.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </td>

                {/* Links */}
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex gap-2">
                    {talent.linkedinUrl && (
                      <a
                        href={talent.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-[#135bec] transition-colors"
                        title="LinkedIn"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>link</span>
                      </a>
                    )}
                    {talent.cvFileName && (
                      <button className="text-slate-400 hover:text-[#135bec] transition-colors" title="CV">
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>description</span>
                      </button>
                    )}
                    <a
                      href={`mailto:${talent.email}`}
                      className="text-slate-400 hover:text-[#135bec] transition-colors"
                      title="Email"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 18 }}>mail</span>
                    </a>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-4 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => navigate(`/talent/edit/${talent.id}`)}
                      className="p-1.5 text-slate-400 hover:text-[#135bec] hover:bg-[#135bec]/10 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>edit</span>
                    </button>
                    {onDelete && (
                      <button
                        onClick={() => onDelete(talent.id)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>delete</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}