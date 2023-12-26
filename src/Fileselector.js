import { useState } from "react";
import "./Fileselector.css";
import jsPDF from "jspdf";

function Fileselector() {
  const [filename, setFilename] = useState(""); // a file to store file name
  const [paths, setPaths] = useState([]); // an array to store file paths

  const onSelectionChange = (event) => {
    const selectedFiles = event.target.files;
    const selectedPaths = Array.from(selectedFiles).map((file) =>
      URL.createObjectURL(file)
    );

    setPaths(selectedPaths);
  };

  const ConvertToPdf = async () => {
    if (filename === "" || paths.length === 0) {
      alert("Please enter a filename and select images");
      return;
    }

    const pdf = new jsPDF();

    const addImageToPdf = async (path, index) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = path;

        img.onload = () => {
          if (index > 0) {
            pdf.addPage();
          }

          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();

          const imgWidth = img.width;
          const imgHeight = img.height;

          console.log(imgWidth, imgHeight);
          
          const scaleFactor = Math.min(
            pageWidth / imgWidth,
            pageHeight / imgHeight
          );
          console.log(scaleFactor);
          const scaledWidth = imgWidth * scaleFactor;
          const scaledHeight = imgHeight * scaleFactor;

          console.log(scaledWidth, scaledHeight);
          const xOffset = (pageWidth - scaledWidth) / 2;
          const yOffset = (pageHeight - scaledHeight) / 2;

          pdf.addImage(
            img,
            "JPEG",
            xOffset,
            yOffset,
            scaledWidth,
            scaledHeight
          );

          resolve();
        };
      });
    };

    // Iterate through images sequentially
    for (let i = 0; i < paths.length; i++) {
      await addImageToPdf(paths[i], i);
    }

    // Save the PDF after all images are loaded
    pdf.save(`${filename}.pdf`);
  };

  return (
    <>
      <div className="Fileselector">
        <label className="fileselectorlabel" for="file">
          Choose files to convert
        </label>
        <input
          type="file"
          id="file"
          name="file"
          multiple
          onChange={onSelectionChange}
        />

        {/* Display selected file paths */}
        {paths.length > 0 && (
          <div>
            <p>Selected File Paths:</p>
            <ul>
              {paths.map((path, index) => (
                <li key={index}>{path}</li>
              ))}
            </ul>
          </div>
        )}
        <input
          placeholder="Enter filename"
          className="filenameinput"
          type="text"
          onChange={(e) => setFilename(e.target.value)}
        />
        <button className="convertbtn" onClick={ConvertToPdf}>
          Convert
        </button>
      </div>
    </>
  );
}

export default Fileselector;
