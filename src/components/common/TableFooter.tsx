/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { COLORS, ICON_PATHS } from "../../constants";
import { Icon } from "./UIElements";

interface TableFooterProps {
  page: number;
  setPage: (page: number | ((p: number) => number)) => void;
  rpp: number;
  setRpp: (rpp: number) => void;
  total: number;
  s: number;
  e: number;
  count: number;
}

export function TableFooter({ page, setPage, rpp, setRpp, total, s, e, count }: TableFooterProps) {
  const [rppOpen, setRppOpen] = useState(false);

  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 24,
      padding: "4px 8px", background: "rgba(140,145,164,0.05)",
      borderTop: count > 0 ? `1px solid ${COLORS.DIV}` : "none"
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, position: "relative" }}>
        <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 12, color: COLORS.TS, whiteSpace: "nowrap" }}>Rows per page:</span>
        <button onClick={() => setRppOpen(o => !o)} style={{ display: "flex", alignItems: "center", gap: 2, background: "none", border: "none", cursor: "pointer", fontFamily: "'Poppins',sans-serif", fontSize: 12, color: COLORS.TP, padding: "2px 4px" }}>
          {rpp}<Icon d={ICON_PATHS.chevD} size={18} color={COLORS.TS} />
        </button>
        <AnimatePresence>
          {rppOpen && (
            <>
              <div onClick={() => setRppOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 10 }} />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                style={{ position: "absolute", bottom: "100%", right: 0, background: "white", border: `1px solid ${COLORS.DIV}`, borderRadius: 4, boxShadow: "0 4px 12px rgba(0,0,0,.12)", zIndex: 20, overflow: "hidden" }}
              >
                {[5, 10, 25].map(n => (
                  <div key={n} onClick={() => { setRpp(n); setPage(0); setRppOpen(false); }}
                    style={{ padding: "8px 20px", cursor: "pointer", fontSize: 12, fontFamily: "'Poppins',sans-serif", color: COLORS.TP, background: n === rpp ? COLORS.PL : "white" }}
                    onMouseEnter={e => { if (n !== rpp) e.currentTarget.style.background = "#f5f5f5"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = n === rpp ? COLORS.PL : "white"; }}>
                    {n}
                  </div>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
      <span style={{ fontFamily: "'Poppins',sans-serif", fontSize: 12, color: COLORS.TP, whiteSpace: "nowrap" }}>
        {count === 0 ? "0" : `${s}–${e}`} of {count}
      </span>
      <div style={{ display: "flex" }}>
        {[
          { d: ICON_PATHS.chevL, dis: page === 0, fn: () => setPage(p => Math.max(0, p - 1)) },
          { d: ICON_PATHS.chevR, dis: page >= total - 1, fn: () => setPage(p => Math.min(total - 1, p + 1)) }
        ].map(({ d, dis, fn }, i) => (
          <button key={i} onClick={fn} disabled={dis} style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: 36, height: 36, borderRadius: "50%", border: "none", background: "none",
            cursor: dis ? "default" : "pointer", color: dis ? "rgba(0,0,0,.26)" : COLORS.TP
          }}>
            <Icon d={d} size={20} />
          </button>
        ))}
      </div>
    </div>
  );
}
