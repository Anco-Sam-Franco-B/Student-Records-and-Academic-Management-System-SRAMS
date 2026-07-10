import React, { useEffect, useState } from "react";
import {
  Database,
  Download,
  Play,
  RotateCcw,
  Search,
  RefreshCcw,
  HardDrive,
  X,
  LoaderCircle
} from "lucide-react";

import api from "../../api/client";
import toast from "react-hot-toast";


export default function Backups() {


  const [backups, setBackups] = useState([]);

  const [loading, setLoading] = useState(true);

  const [backupLoading, setBackupLoading] = useState(false);

  const [search, setSearch] = useState("");


  // Modal states
  const [showModal, setShowModal] = useState(false);

  const [previewLoading, setPreviewLoading] = useState(false);

  const [previewData, setPreviewData] = useState(null);

  const [selectedBackup, setSelectedBackup] = useState(null);





  const fetchBackups = async () => {

    try {


      setLoading(true);


      const response =
        await api.get("/backups");



      setBackups(
        response.data.data || []
      );



    } catch (error) {

      toast.error(
        "Failed to load backups"
      );


    } finally {

      setLoading(false);

    }

  };





  useEffect(() => {

    fetchBackups();

  }, []);








  const handleBackup = async () => {


    try {


      setBackupLoading(true);



      const response =
        await api.post(
          "/backups/trigger"
        );



      toast.success(
        response.data.message
      );



      fetchBackups();



    } catch (error) {


      toast.error(
        error.response?.data?.message ||
        "Backup failed"
      );



    } finally {


      setBackupLoading(false);

    }


  };









  const handleDownload = (id) => {


    window.open(

      `${import.meta.env.VITE_API_URL}/backups/download/${id}`,

      "_blank"

    );


  };










  const handlePreview = async (backup) => {


    try {


      setPreviewLoading(true);

      setSelectedBackup(backup);

      setShowModal(true);



      const response =
        await api.get(
          `/backups/view/${backup.id}`
        );



      setPreviewData(
        response.data
      );



    } catch (error) {


      toast.error(
        "Failed to read backup"
      );


    } finally {


      setPreviewLoading(false);

    }


  };









  const handleRestore = async (id) => {


    const confirm =
      window.confirm(
        "Restore this backup? Current data will be replaced."
      );



    if (!confirm)
      return;




    try {


      await api.post(
        `/backups/restore/${id}`
      );



      toast.success(
        "Backup restored successfully"
      );



    } catch (error) {


      toast.error(
        error.response?.data?.message ||
        "Restore failed"
      );


    }


  };







  const filteredBackups =
    backups.filter(item =>

      item.file_name
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )

    );





  const totalSize =
    backups.reduce(
      (sum, item) =>
        sum + Number(item.file_size),
      0
    );






  return (

    <div className="
p-6
space-y-6
">



      {/* Header */}

      <div className="
flex
justify-between
items-center
flex-col
md:flex-row
gap-4
">


        <div>

          <h1 className="
text-3xl
font-bold
text-gray-800
">

            Database Backups

          </h1>


          <p className="
text-gray-500
">

            Manage and restore system backups.

          </p>


        </div>




        <button

          onClick={handleBackup}

          disabled={backupLoading}

          className="
flex
items-center
gap-2
px-5
py-3
rounded-xl
bg-gradient-to-r
from-blue-600
to-indigo-600
text-white
font-semibold
shadow-lg
hover:scale-105
transition
disabled:opacity-50
"

        >


          {
            backupLoading ?

              <div className="
w-5
h-5
border-2
border-white
border-t-transparent
rounded-full
animate-spin
"/>

              :

              <Play size={18} />

          }


          {
            backupLoading
              ?
              "Creating Backup..."
              :
              "Trigger Backup Now"
          }


        </button>



      </div>







      {/* Cards */}

      <div className="
grid
md:grid-cols-3
gap-5
">


        <div className="
bg-white
border
rounded-2xl
p-5
flex
gap-4
items-center
">


          <div className="
bg-blue-100
text-blue-600
p-3
rounded-xl
">

            <Database />

          </div>


          <div>

            <p className="text-gray-500 text-sm">
              Total Backups
            </p>


            <h2 className="text-2xl font-bold">

              {backups.length}

            </h2>


          </div>


        </div>





        <div className="
bg-white
border
rounded-2xl
p-5
flex
gap-4
items-center
">

          <div className="
bg-green-100
text-green-600
p-3
rounded-xl
">

            <HardDrive />

          </div>


          <div>

            <p className="text-gray-500 text-sm">
              Storage
            </p>


            <h2 className="text-2xl font-bold">

              {
                (totalSize / 1024 / 1024)
                  .toFixed(2)
              }

              MB

            </h2>


          </div>

        </div>





        <div className="
bg-white
border
rounded-2xl
p-5
flex
gap-4
items-center
">


          <div className="
bg-purple-100
text-purple-600
p-3
rounded-xl
">

            <Database />

          </div>


          <div>

            <p className="text-gray-500 text-sm">
              Latest
            </p>


            <h2 className="font-bold">

              {
                backups[0]
                  ?
                  new Date(
                    backups[0].created_at
                  )
                    .toLocaleDateString()
                  :
                  "No Backup"
              }

            </h2>


          </div>


        </div>


      </div>









      {/* Table */}


      <div className="
bg-white
border
rounded-2xl
overflow-hidden
">


        <div className="
p-5
bg-gray-50
border-b
flex
justify-between
">


          <div className="relative">


            <Search

              className="
absolute
left-3
top-3
text-gray-400
"

            />


            <input

              value={search}

              onChange={(e) =>
                setSearch(e.target.value)
              }

              placeholder="Search backup"

              className="
pl-10
py-2
border
rounded-xl
outline-none
"

            />


          </div>



          <button

            onClick={fetchBackups}

            className="
flex
gap-2
items-center
px-4
rounded-xl
border
hover:bg-gray-100
"

          >

            <RefreshCcw size={16} />

            Refresh

          </button>


        </div>





        <table className="
w-full
text-left
">


          <thead className="bg-gray-100">


            <tr>


              <th className="px-6 py-4">
                File
              </th>


              <th className="px-6 py-4">
                Size
              </th>


              <th className="px-6 py-4">
                Date
              </th>


              <th className="px-6 py-4">
                Action
              </th>


            </tr>


          </thead>




          <tbody className="divide-y">


            {
              filteredBackups.map(backup => (


                <tr
                  key={backup.id}
                  className="
hover:bg-gray-50
"
                >


                  <td className="px-6 py-4 font-semibold">


                    {backup.file_name}


                  </td>




                  <td className="px-6 py-4">


                    {
                      (
                        backup.file_size /
                        1024 /
                        1024
                      )
                        .toFixed(2)
                    }

                    MB


                  </td>



                  <td className="px-6 py-4">


                    {
                      new Date(
                        backup.created_at
                      )
                        .toLocaleString()
                    }


                  </td>



                  <td className="px-6 py-4">


                    <div className="flex gap-2">


                      <button

                        onClick={() =>
                          handlePreview(backup)
                        }

                        className="
p-2
rounded-lg
bg-purple-100
text-purple-600
"

                      >

                        <Database size={17} />

                      </button>




                      <button

                        onClick={() =>
                          handleDownload(backup.id)
                        }

                        className="
p-2
rounded-lg
bg-blue-100
text-blue-600
"

                      >

                        <Download size={17} />

                      </button>




                      <button

                        onClick={() =>
                          handleRestore(backup.id)
                        }

                        className="
p-2
rounded-lg
bg-orange-100
text-orange-600
"

                      >

                        <RotateCcw size={17} />

                      </button>



                    </div>


                  </td>


                </tr>


              ))

            }


          </tbody>


        </table>



      </div>










      {/* JSON MODAL */}


      {
        showModal && (

          <div className="
fixed
inset-0
-top-6 h-screen 
backdrop-blur-sm
bg-black/50
z-50
flex
items-center
justify-center
p-5
">


            <div className="
bg-white
rounded-2xl
w-full
max-w-5xl
overflow-hidden
">


              <div className="
flex
justify-between
items-center
p-5
border-b
bg-gray-50
border-gray-100
">


                <div>

                  <h2 className="font-bold text-xl">

                    Backup Preview

                  </h2>


                  <p className="text-sm text-gray-500">

                    {selectedBackup?.file_name}

                  </p>


                </div>



                <button

                  onClick={() =>
                    setShowModal(false)
                  }

                >

                  <X />

                </button>


              </div>





              <div className="
p-5
max-h-[550px]
overflow-auto
">


                {
                  previewLoading ?


                    <div className="w-full flex justify-center gap-3 items-center p-5 text-blue-500">
                      <LoaderCircle className="size-6 animate-spin" />
                      <p className="animate-pulse">Loading JSON file...</p>
                    </div>


                    :


                    <pre className="
bg-gray-900
text-green-400
p-5
rounded-xl
text-sm
">

                      {
                        JSON.stringify(
                          previewData,
                          null,
                          2
                        )
                      }


                    </pre>


                }


              </div>



            </div>


          </div>

        )

      }


    </div>

  );

}