import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import ChartDataLabels from "chartjs-plugin-datalabels";

const CONTRACT_COLORS = {
  "RENOVAÇÃO CONFIRMADA":"#10B981",
  "RENOVAÇÃO PENDENTE":"#F59E0B",
  "SEM PROVISÃO":"#6B7280"
};
const MAQ_COLORS = { OPERACIONAL:"#10B981", PARADA:"#EF4444", "DISPONÍVEL":"#F59E0B", MANUTENÇÃO:"#3B82F6" };

const textColor = () => (document.documentElement.classList.contains("dark") ? "#E5E7EB" : "#6B7280");

export default function ChartsPanel({ contracts = [], onClickMachine, onClickContrato }) {
  const mRef = useRef(null);
  const cRef = useRef(null);
  const mChart = useRef(); const cChart = useRef();

  useEffect(()=>{ Chart.register(ChartDataLabels); }, []);

  useEffect(()=>{
    mChart.current?.destroy(); cChart.current?.destroy();

    const mCounts = { OPERACIONAL:0, PARADA:0, "DISPONÍVEL":0, MANUTENÇÃO:0 };
    contracts.forEach(c => (c.maquinas||[]).forEach(m => { mCounts[m.status] = (mCounts[m.status]||0)+1; }));

    mChart.current = new Chart(mRef.current, {
      type:"doughnut",
      data:{
        labels:Object.keys(mCounts),
        datasets:[{ data:Object.values(mCounts), backgroundColor:Object.keys(mCounts).map(k=>MAQ_COLORS[k]),
          borderColor: document.documentElement.classList.contains("dark") ? "#0f172a" : "#fff", borderWidth:2 }]
      },
      options:{
        cutout:"68%",
        plugins:{
          legend:{ position:"bottom", labels:{ color:textColor() } },
          datalabels:{
            color:"#fff", formatter:(v,ctx)=> {
              const total = ctx.chart.data.datasets[0].data.reduce((a,b)=>a+b,0);
              return v && total ? `${Math.round((v/total)*100)}%` : "";
            }
          }
        },
        onClick:(_, els, chart)=> { if(els.length){ onClickMachine?.(chart.data.labels[els[0].index]); } }
      }
    });

    const cCounts = { "RENOVAÇÃO CONFIRMADA":0, "RENOVAÇÃO PENDENTE":0, "SEM PROVISÃO":0 };
    contracts.forEach(c => { cCounts[c.statusContrato] = (cCounts[c.statusContrato]||0)+1; });
    const labels = Object.keys(cCounts);

    cChart.current = new Chart(cRef.current, {
      type:"bar",
      data:{ labels:labels.map(l=>l.toUpperCase()),
        datasets:[{ data:labels.map(l=>cCounts[l]), backgroundColor:labels.map(l=>CONTRACT_COLORS[l]), barThickness:22 }]},
      options:{
        indexAxis:"y",
        plugins:{ legend:{ display:false }},
        scales:{
          x:{ ticks:{ color:textColor() }, grid:{ color:textColor()+"22" } },
          y:{ ticks:{ color:textColor() }, grid:{ display:false } }
        },
        onClick:(_, els, chart)=>{
          if(els.length){
            const up = chart.data.labels[els[0].index];
            const original = labels.find(k => k.toUpperCase() === up);
            onClickContrato?.(original);
          }
        }
      }
    });

    return ()=>{ mChart.current?.destroy(); cChart.current?.destroy(); };
  }, [contracts]);

  return (
    <aside className="panel">
      <div>
        <h3>Distribuição de Máquinas</h3>
        <canvas ref={mRef}/>
      </div>
      <div className="divider"></div>
      <div>
        <h3>Status dos Contratos</h3>
        <canvas ref={cRef}/>
      </div>
    </aside>
  );
}
