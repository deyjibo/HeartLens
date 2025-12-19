import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import pdfLogo from "./medinauts.PNG"; // PDF logo

/* ---------------- PARAMETER LABELS ---------------- */
const PARAMETER_LABELS = {
  age: "AGE",
  sex: "SEX",
  cp: "CHEST PAIN TYPE",
  trestbps: "RESTING BLOOD PRESSURE",
  chol: "SERUM CHOLESTEROL",
  fbs: "FASTING BLOOD SUGAR",
  restecg: "RESTING ECG RESULTS",
  thalach: "MAX HEART RATE",
  exang: "EXERCISE INDUCED ANGINA",
  oldpeak: "ST DEPRESSION",
  slope: "ST SLOPE",
  ca: "MAJOR VESSELS",
  thal: "THALASSEMIA",
};

const formatValue = (key, value) => {
  switch (key) {
    case "sex": return value === "1" ? "Male" : "Female";
    case "exang": return value === "1" ? "Yes" : "No";
    case "fbs": return value === "1" ? "> 120 mg/dL" : "≤ 120 mg/dL";
    case "chol": return `${value} mg/dL`;
    case "trestbps": return `${value} mm Hg`;
    case "thalach": return `${value} BPM`;
    case "ca": return `${value} Vessels`;
    default: return value;
  }
};

const HeartResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const form = location.state;

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [patientName, setPatientName] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  useEffect(() => {
    if (!form) return;

    const fetchPrediction = async () => {
      try {
        const API_URL = process.env.REACT_APP_API_URL;
        const response = await fetch(`${API_URL}/predict`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        setPrediction(await response.json());
      } catch {
        setPrediction(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPrediction();
  }, [form]);

  if (!form) return <p>No data provided</p>;

  /* ---------------- PDF GENERATION ---------------- */
  const generatePDF = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString();
    const diagnosis =
      prediction?.prediction === 1
        ? "POSITIVE FOR HEART DISEASE RISK"
        : "NEGATIVE FOR HEART DISEASE RISK (NORMAL)";
    const riskValue = prediction ? Math.round(prediction.probability * 100) : 0;

    let y = 20;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("CARDIOLOGY REPORT", 105, y, { align: "center" });

    y += 10;
    doc.setFontSize(12);
    doc.text("Patient Medical Report", 105, y, { align: "center" });

    y += 10;
    doc.setFont("helvetica", "normal");
    doc.text(`Patient Name: ${patientName || "Patient"}`, 20, y);
    doc.text(`Date: ${date}`, 150, y);

    y += 20;
    doc.setFont("helvetica", "bold");
    doc.text("Cardiac Stress Test Parameters:", 20, y);

    y += 10;
    Object.entries(form).forEach(([key, value]) => {
      if (!PARAMETER_LABELS[key]) return;
      doc.setFont("helvetica", "normal");
      doc.text(`${PARAMETER_LABELS[key]} : ${formatValue(key, value)}`, 25, y);
      y += 8;
    });

    y += 10;
    doc.setFont("helvetica", "bold");
    doc.text("Diagnosis Conclusion:", 20, y);
    doc.text(diagnosis, 20, y + 12);

    doc.setFont("helvetica", "normal");
    doc.text(`Estimated Risk Score: ${riskValue}%`, 20, y + 24);

    // Bottom bold + underline line
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    const lineText = "This is a computer generated printout and no signature is required";
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    const textWidth = doc.getTextWidth(lineText);
    const textX = (pageWidth - textWidth) / 2;
    const textY = pageHeight - 65;
    doc.text(lineText, textX, textY);
    doc.setLineWidth(0.5);
    doc.line(textX, textY + 1.5, textX + textWidth, textY + 1.5);

    const logoWidth = 30;
    const logoHeight = 30;
    const logoX = (pageWidth - logoWidth) / 2;
    const logoY = pageHeight - 45;
    doc.addImage(pdfLogo, "PNG", logoX, logoY, logoWidth, logoHeight);

    doc.text("Made by MediNauts © 2025", pageWidth / 2, pageHeight - 10, { align: "center" });

    doc.save("Medical_Report.pdf");
  };

  return (
    <div style={overlay}>
      <div style={card}>
        <button style={closeBtn} onClick={() => navigate(-1)}>×</button>

        <h1 style={mainTitle}>Heart Disease Prediction Result</h1>
        <p style={subTitle}>Based on your submitted clinical parameters</p>

        <div style={nameWrapper}>
          <input
            placeholder="Enter Patient Name"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            style={nameInput}
          />
        </div>

        <div style={resultBox}>
          {loading ? (
            <p>Loading prediction...</p>
          ) : (
            <>
              <h2 style={riskTitle}>
                {prediction?.prediction === 1 ? "⚠️ High Risk Detected" : "✅ Low Risk Detected"}
              </h2>
              <p style={riskPercentage}>
                Estimated Risk Score: {prediction ? Math.round(prediction.probability * 100) : 0}%
              </p>
              {prediction && (
                <div style={{
                  marginTop: 6,
                  fontWeight: "bold",
                  color: prediction.prediction === 1 ? "red" : "green"
                }}>
                  {prediction.prediction === 1
                    ? "⚠️ The model predicts that you have heart disease."
                    : "✅ The model predicts that you do not have heart disease."}
                </div>
              )}
            </>
          )}
        </div>

        <h3 style={sectionTitle}>Your Entered Parameters</h3>
        <div style={grid}>
          {Object.entries(form).map(([key, value]) => (
            PARAMETER_LABELS[key] && (
              <div key={key} style={infoItem}>
                <span style={infoLabel}>{PARAMETER_LABELS[key]} :</span>
                <span style={infoValue}>{formatValue(key, value)}</span>
              </div>
            )
          ))}
        </div>

        <div style={btnRow}>
          <button
            style={btn}
            onMouseEnter={(e) => e.currentTarget.style.backgroundPosition = "left center"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundPosition = "right center"}
            onClick={() => navigate(-1)}
          >
            Analyze New Patient
          </button>
          <button
            style={btn}
            onMouseEnter={(e) => e.currentTarget.style.backgroundPosition = "left center"}
            onMouseLeave={(e) => e.currentTarget.style.backgroundPosition = "right center"}
            onClick={generatePDF}
          >
            Generate PDF
          </button>
        </div>

        {/* Extra space at bottom */}
        <div style={{ height: 30 }}></div>
      </div>
    </div>
  );
};

/* ---------------- STYLES ---------------- */
const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  background: "rgba(0,0,0,0.65)",
  backdropFilter: "blur(8px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

const card = {
  width: "90%",
  maxWidth: 1000,
  background: "#fff",
  borderRadius: 20,
  padding: "30px 40px",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
};

const closeBtn = { position: "absolute", top: 15, right: 20, fontSize: 30, border: "none", background: "none" };
const mainTitle = { textAlign: "center", color: "red", fontWeight: 700 };
const subTitle = { textAlign: "center", marginBottom: 20 };
const nameWrapper = { display: "flex", justifyContent: "center", marginBottom: 20 };
const nameInput = { width: "60%", padding: 12, borderRadius: 12, border: "1px solid #ccc", textAlign: "center" };
const resultBox = { background: "#f6f6f6", padding: 20, borderRadius: 20, textAlign: "center", marginBottom: 20 };
const riskTitle = { fontSize: 22, fontWeight: 700 };
const riskPercentage = { fontSize: 16 };
const sectionTitle = { fontWeight: 600, marginBottom: 10 };
const grid = { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 };
const infoItem = { background: "#fafafa", padding: 12, borderRadius: 12 };
const infoLabel = { fontSize: 12, fontWeight: 600 };
const infoValue = { fontSize: 14, fontWeight: 700 };
const btnRow = { display: "flex", justifyContent: "center", gap: 14, marginTop: 25 };
const btn = {
  backgroundSize: "200% auto",
  backgroundImage:
    "linear-gradient(to right,#00008b 0%,#00008b 50%,#ff0000 50%,#ff0000 100%)",
  color: "#fff",
  padding: "12px 22px",
  borderRadius: 15,
  border: "none",
  cursor: "pointer",
  transition: "0.4s ease",
  backgroundPosition: "right center",
};

export default HeartResult;
