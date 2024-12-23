"use client";
import withAuth from "./withAuth";
import { useRouter } from "next/navigation"; 
import { useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

// Registering chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function UploadAndVisualize() {
  const [file, setFile] = useState(null);
  const [sentimentData, setSentimentData] = useState(null);
  const [tableData, setTableData] = useState([]);
  const router=useRouter()
  const token = localStorage.getItem("token"); // Get the token

  if (!token) {
    alert("You must be logged in to upload a file.");
    return;
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Please select a CSV file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("https://rahim-khan-iitg-sentiment-analysis.hf.space/upload-csv/", formData, {
        headers: { "Content-Type": "multipart/form-data" ,"Authorization":`Bearer ${token}`},
      });

      // Set sentiment counts for chart visualization
      setSentimentData(res.data.sentiment_counts);

      // Set table data to display in a table
      setTableData(res.data.sentiments); // Assuming the backend sends sentiment data in this format
    } catch (error) {
      console.error("Error analyzing sentiments:", error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Upload CSV and Visualize Sentiments</h1>

      <form onSubmit={handleSubmit} className="mb-6 text-center">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="border border-gray-300 rounded-md py-1 px-4 text-lg mb-4"
        />
        <button type="submit" className="bg-green-500 text-white mx-2 py-2 px-6 rounded-md hover:bg-green-600 transition duration-300">
          Upload
        </button>
      </form>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          router.push("/login");
        }}
        className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300"
      >
        Logout
      </button>

      {sentimentData && (
        <div className="mt-12">
          <h2 className="text-2xl font-medium text-gray-800 mb-6">Sentiment Analysis</h2>

          {/* Bar and Pie Charts */}
          <div className="mb-8">
            <Bar
              data={{
                labels: Object.keys(sentimentData),
                datasets: [
                  {
                    label: "Sentiment Counts",
                    data: Object.values(sentimentData),
                    backgroundColor: ["#264653", "#2A9D8F", "#E9C46A", "#F4A261", "#E76F51"],
                  },
                ],
              }}
            />
          </div>
          <div className="mb-8">
            <Pie
              data={{
                labels: Object.keys(sentimentData),
                datasets: [
                  {
                    label: "Sentiment Distribution",
                    data: Object.values(sentimentData),
                    backgroundColor: ["#264653", "#2A9D8F", "#E9C46A", "#F4A261", "#E76F51"],
                  },
                ],
              }}
            />
          </div>

          {/* Data Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse border border-gray-300">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left text-gray-700">ID</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-gray-700">Text</th>
                  <th className="border border-gray-300 px-4 py-2 text-left text-gray-700">Sentiment</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.text}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.sentiment}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
export default withAuth(UploadAndVisualize);