import Image from "next/image";
import { Inter } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import Snackbar, { SnackbarOrigin } from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import axios from "axios";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [files, setFiles] = useState<any>(null);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [stateAlert, setStateAlert] = useState(false)
  const [stateErrorMessage, setStateMessage] = useState<string>("")
  const [dataRow, setDataRow] = useState<string>("")
  const inputRef = useRef<any>(null);
  const [dataList, setDataList] = useState([]);
  const [list, setList] = useState([
      { name: "file1.pdf", upload_at: "2024-05-05", user_upload: "User A" },
      { name: "file2.docx", upload_at: "2024-05-06", user_upload: "User B" },
      { name: "file3.jpg", upload_at: "2024-05-07", user_upload: "User C" },
    ]);

  function handleChange(e: any) {
    e.preventDefault();
    console.log("File has been added");
    if (e.target.files && e.target.files[0]) {
      console.log(e.target.files);
        setFiles(e.target.files[0]);
    }
  }

  function handleSubmitFile(e: any) { 
    if (files.length === 0) {
      setStateAlert(true);
      setStateMessage("No file has been submitted")
      // fetchData();

    } else if (files.length > 1) {
      // creete a toast or alert to notify the user
      // alert("File more than 1");    
  } else {
      // write submit logic here
    }
  }

  const fetchData = async () => {
    const response = await axios("/api/hello");
    setDataList(response.data);
  }

  useEffect(() => {
    fetchData();
  }, []);

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
          onClose={( ) => setStateAlert(false)}
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
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          {dataList.map((data: any, idx: any) => (
            <div key={idx} className="flex flex-row space-x-5">
              <span>{data.name}</span>
            </div>
          ))}
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/vercel.svg"
              alt="Vercel Logo"
              className="dark:invert"
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

    </main>
  );
}
