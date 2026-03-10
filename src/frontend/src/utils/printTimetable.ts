import {
  COURSES,
  DAYS,
  ROOMS,
  TIME_SLOTS,
  type TimetableCell,
} from "../data/mockData";

export interface PrintTimetableOptions {
  timetable: TimetableCell[];
  title: string;
  subtitle?: string;
  filterTeacherId?: string;
}

function getCourseById(id: number | null) {
  if (!id) return null;
  return COURSES.find((c) => c.id === id) ?? null;
}

function getRoomById(id: number | null) {
  if (!id) return null;
  return ROOMS.find((r) => r.id === id) ?? null;
}

export function printTimetable(options: PrintTimetableOptions) {
  const { timetable, title, subtitle, filterTeacherId } = options;

  const getCell = (day: string, period: string): TimetableCell | undefined =>
    timetable.find((c) => c.day === day && c.period === period);

  // Build the timetable rows HTML
  const rows = TIME_SLOTS.map((slot) => {
    if (slot.isBreak) {
      const bg = slot.breakType === "lunch" ? "#fef9c3" : "#f3f4f6";
      return `
        <tr style="background:${bg};">
          <td colspan="7" style="padding:6px 12px;text-align:center;font-size:11px;font-weight:600;color:#6b7280;border-bottom:1px solid #e5e7eb;">
            ${slot.label} &nbsp;<span style="color:#9ca3af;">${slot.time}</span>
          </td>
        </tr>`;
    }

    const dayCells = DAYS.map((day) => {
      const cell = getCell(day.id, slot.id);
      const course = getCourseById(cell?.courseId ?? null);
      const room = getRoomById(cell?.roomId ?? null);

      // If filtering by teacher and this cell doesn't match, show a dash
      if (filterTeacherId && cell?.teacherId !== filterTeacherId) {
        return `<td style="padding:6px 4px;text-align:center;border-bottom:1px solid #e5e7eb;min-width:90px;font-size:11px;color:#d1d5db;">—</td>`;
      }

      if (course) {
        return `
          <td style="padding:4px;text-align:center;border-bottom:1px solid #e5e7eb;min-width:90px;">
            <div style="display:inline-flex;flex-direction:column;align-items:center;padding:4px 6px;border-radius:6px;background:${course.color};color:#fff;width:100%;box-sizing:border-box;">
              <span style="font-size:11px;font-weight:700;line-height:1.2;">${course.code}</span>
              ${room ? `<span style="font-size:9px;opacity:0.85;line-height:1.2;">${room.name}</span>` : ""}
              ${!filterTeacherId ? `<span style="font-size:9px;opacity:0.75;line-height:1.2;">${course.teacherName.split(" ")[1]}</span>` : ""}
            </div>
          </td>`;
      }

      return `<td style="padding:6px 4px;text-align:center;border-bottom:1px solid #e5e7eb;min-width:90px;font-size:11px;color:#d1d5db;">Free</td>`;
    }).join("");

    return `
      <tr>
        <td style="padding:8px 10px;border-bottom:1px solid #e5e7eb;border-right:1px solid #e5e7eb;background:#f8fafc;white-space:nowrap;">
          <div style="font-size:11px;font-weight:700;color:#1e293b;">${slot.label}</div>
          <div style="font-size:9px;color:#64748b;font-family:monospace;">${slot.time}</div>
        </td>
        ${dayCells}
      </tr>`;
  }).join("");

  // Build legend
  const deptCourses = filterTeacherId
    ? COURSES.filter((c) => c.teacherId === filterTeacherId)
    : COURSES.filter((c) => timetable.some((cell) => cell.courseId === c.id));

  const legendHtml =
    deptCourses.length > 0
      ? `<div style="margin-top:16px;display:flex;flex-wrap:wrap;gap:8px;">
        ${deptCourses
          .map(
            (c) => `
          <div style="display:flex;align-items:center;gap:6px;font-size:11px;">
            <span style="display:inline-block;width:10px;height:10px;border-radius:3px;background:${c.color};flex-shrink:0;"></span>
            <span style="font-weight:600;">${c.code}</span>
            <span style="color:#64748b;">— ${c.name}</span>
          </div>`,
          )
          .join("")}
      </div>`
      : "";

  const dayHeaders = DAYS.map(
    (d) =>
      `<th style="padding:8px 6px;text-align:center;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#fff;min-width:90px;">${d.label}</th>`,
  ).join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: 'Segoe UI', Arial, sans-serif; background: #fff; color: #1e293b; padding: 24px; }
    @media print {
      body { padding: 12px; }
      .no-print { display: none !important; }
    }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: none; }
  </style>
</head>
<body>
  <!-- Header -->
  <div style="margin-bottom:20px;border-bottom:3px solid #1e3a8a;padding-bottom:14px;">
    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;">
      <div>
        <div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#0d9488;margin-bottom:4px;">CHRONO CLASS</div>
        <h1 style="font-size:20px;font-weight:800;color:#1e3a8a;margin-bottom:4px;">${title}</h1>
        ${subtitle ? `<p style="font-size:12px;color:#64748b;">${subtitle}</p>` : ""}
      </div>
      <div style="text-align:right;font-size:10px;color:#94a3b8;">
        <div>Generated: ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}</div>
        <div>Even Semester 2024-25</div>
      </div>
    </div>
  </div>

  <!-- Timetable -->
  <table>
    <thead>
      <tr style="background:#1e3a8a;">
        <th style="padding:8px 10px;text-align:left;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:#fff;width:100px;border-right:1px solid rgba(255,255,255,0.2);">Period</th>
        ${dayHeaders}
      </tr>
    </thead>
    <tbody>
      ${rows}
    </tbody>
  </table>

  <!-- Legend -->
  ${legendHtml}

  <!-- Footer -->
  <div style="margin-top:20px;padding-top:10px;border-top:1px solid #e2e8f0;display:flex;justify-content:space-between;font-size:10px;color:#94a3b8;">
    <span>Chrono Class — AI-Based Intelligent Timetable Scheduling System</span>
    <span>Confidential — For Internal Use Only</span>
  </div>

  <script>
    window.onload = function() {
      window.print();
    };
  </script>
</body>
</html>`;

  const printWindow = window.open("", "_blank", "width=1000,height=700");
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
  }
}
