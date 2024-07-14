import { Inter } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import axios from "axios";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from "@mui/material";
import Paper from '@mui/material/Paper';
import { parseCookies } from "nookies";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';


const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [files, setFiles] = useState<any>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [stateAlert, setStateAlert] = useState(false)
  const [stateErrorMessage, setStateMessage] = useState<string>("")
  const [stateSuccess, setStateSuccess] = useState(false)
  const inputRef = useRef<any>(null);
  const [dataHello, setDataHello] = useState([]);
  const [dataList, setDataList] = useState([]);
  const [helloName, setHelloName] = useState("");

  const fetchHello = async () => {
    const response = await axios("/api/hello");
    setDataHello(response.data);
  }

  const fetchFiles = async (page: number) => {
    try {
      const response = await axios.get("/api/files", {
        params: {
          page: page,
        },
      });
      setDataList(response.data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  }


  useEffect(() => {
    const { token } = parseCookies();
    setHelloName(token);
    fetchFiles(1);
  }, []);

  function logout() {
    document.cookie
      .split(";")
      .forEach(function (c) {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });
    window.location.href = "/login";
  }

  // FILES DRAGF N DROP
  function handleChange(e: any) {
    e.preventDefault();
    console.log("File has been added");
    if (e.target.files && e.target.files[0]) {
      console.log(e.target.files);
      setFiles(e.target.files[0]);
    }
  }

  function handleSubmitFile(e: any) {
    if (!files) {
      setStateAlert(true);
      setStateMessage("No file has been submitted")
      return;
    }
    // filter extensions here
    const allowedExtensions = [".bin"];
    const fileName = files.name.split(".")[0];
    const fileExtension = files.name.split(".").pop();
    if (!allowedExtensions.includes(`.${fileExtension}`)) {
      setDragActive(false);
      setStateAlert(true);
      setStateMessage("File type not allowed");
      return;
    }
    const data = new FormData();
    data.append("file", files);
    data.append("name", fileName);
    axios.post("/api/upload", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((response) => {
        if (response.status === 200) {
          setStateMessage(response.data.message)
          setStateSuccess(true)
          fetchFiles(1);
        }
        setFiles(null);
      })
      .catch((error) => {
        console.error("Error uploading file:", error);
        setStateAlert(true);
        setStateMessage("Error uploading file")
      });
  }



  function handleDrop(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      for (let i = 0; i < e.dataTransfer.files["length"]; i++) {
        setFiles(e.dataTransfer.files[0]);
      }
    }
  }

  function handleDragLeave(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  }

  function handleDragOver(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function handleDragEnter(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  }

  function removeFile() {
    setFiles(null);
  }

  function openFileExplorer() {
    inputRef.current.value = "";
    inputRef.current.click();
  }
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={stateAlert}
        onClose={() => setStateAlert(false)}
        autoHideDuration={3000}
        className="z-index-[9999]"
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={() => setStateAlert(false)}
          severity="error">
          {stateErrorMessage}
        </MuiAlert>
      </Snackbar>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={stateSuccess}
        onClose={() => setStateSuccess(false)}
        autoHideDuration={3000}
        className="z-index-[9999]"
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={() => setStateSuccess(false)}
          severity="success">
          {stateErrorMessage}
        </MuiAlert>
      </Snackbar>
      <div className="z-10 w-full items-center justify-between font-mono text-sm lg:flex">
        <div className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          <div className="flex flex-row space-x-5">
            <span>Hello {helloName}</span>
          </div>
        </div>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            {/* LOGOUT */}
            <Button variant="outlined" size="small" color="error" onClick={logout}>
              Logout
            </Button>
          </a>
        </div>
      </div>

      <div className="w-full">
        <div className="flex items-center justify-center py-10">
          <form
            className={`${dragActive ? "bg-blue-400" : "bg-blue-100"
              }  p-4 w-1/3 rounded-lg w-[900px] min-h-[10rem] text-center flex flex-col items-center justify-center`}
            onDragEnter={handleDragEnter}
            onSubmit={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
          >
            {/* this input element allows us to select files for upload. We make it hidden so we can activate it when the user clicks select files */}
            <input
              placeholder="fileInput"
              className="hidden"
              ref={inputRef}
              type="file"
              onChange={handleChange}
              accept=".bin"
            />

            <p>
              Drag & Drop files or{" "}
              <span
                className="font-bold text-blue-600 cursor-pointer"
                onClick={openFileExplorer}
              >
                <u>Select files</u>
              </span>{" "}
              to upload
            </p>

            <div className="flex flex-col items-center p-3">
              {files && (
                <div className="flex flex-row space-x-5">
                  <span>{files.name}</span>
                  <span
                    className="text-red-500 cursor-pointer"
                    onClick={() => removeFile()}
                  >
                    remove
                  </span>
                </div>
              )}
            </div>

            <Button component="label" variant="contained" tabIndex={-1} startIcon={<CloudUploadIcon />} onClick={handleSubmitFile}>
              Upload file
              {/* <VisuallyHiddenInput type="file" /> */}
            </Button>
          </form>
        </div>
      </div>


      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">URL</TableCell>
              <TableCell align="right">Upload At</TableCell>
              <TableCell align="right">Upload By</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataList.map((row: any, i) => (
              <TableRow
                key={i}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                <TableCell component="th" scope="row">
                  {row["name"]}
                </TableCell>
                <TableCell align="right">
                  <Button variant="outlined" size="small" onClick={
                    () => {
                      const url = process.env.NEXT_HOST_URL + row["url"];
                      console.log(process.env.NEXT_HOST_URL, "<<< process.env.NEXT_HOST_URL")
                      const link = document.createElement("a");
                      link.href = url;
                      // link.href = "http://localhost:3000/ota/" + row["url"];
                      link.click();
                    }
                  }>
                    Download
                  </Button>
                </TableCell>
                <TableCell align="right">
                  {

                    // row["upload_at"].split("T")[0]
                    row["upload_at"] ? (typeof row["upload_at"] === 'string') ? row["upload_at"].split("T")[0] : row["upload_at"].split(" ")[0] : ""
                  }
                </TableCell>
                <TableCell align="right">{row["upload_by"]}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

    </main>
  );
}
