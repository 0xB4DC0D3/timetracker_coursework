import "./UserDashboard.css";
import { Fragment, useEffect, useRef, useState } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { MenuIcon, XIcon, TrashIcon } from '@heroicons/react/outline';
import Modal from "../components/Modal";
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Select from "../components/Select";
import axios_api from "../axios/axios";
import { PDFExport, savePDF } from "@progress/kendo-react-pdf";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const UserDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [state, setState] = useState({
    showChangeModal: false,
    showDeleteModal: false,
    showAddModal: false,
    pickedFirstDate: new Date(),
    pickedLastDate: new Date(),
    addInput: {
      project: {
        value: "",
        label: ""
      },
      workTime: "",
      workDescription: "",
      dateFrom: (new Date()).toISOString(),
      dateTo: (new Date()).toISOString()
    },
    changeInput: {
      project: {
        value: "",
        label: ""
      },
      workTime: "",
      workDescription: "",
      dateFrom: "",
      dateTo: ""
    },
    projects: [] as {
      value: string;
      label: string;
    }[]
  });

  const [records, setRecords] = useState([{
    recordId: "",
    projectId: "",
    projectName: "",
    workHours: "",
    isApproved: false,
    workDescription: "",
    dateFrom: "",
    dateTo: ""
  }]);

  const [changeInput, setChangeInput] = useState("");
  const [recordToDelete, deleteRecord] = useState("");

  const [updateRecords, setUpdateRecords] = useState(true);
  const [updateProjects, setUpdateProjects] = useState(true);

  useEffect(() => {
    axios_api.get("/get_user_records").then(response => {
      if (updateRecords) {
        setRecords(response.data);
        setUpdateRecords(false);
      }
    });
  }, [updateRecords]);

  useEffect(() => {
    axios_api.get("/get_user_projects").then(response => {
      if (!response.data.error && updateProjects) {
        setState({
          ...state,
          addInput: {
            ...state.addInput,
            project: {
              value: response.data.value,
              label: response.data.label
            }
          },
          projects: [{
            value: response.data.value,
            label: response.data.label
          }]
        });

        setUpdateProjects(false);
      }
    })
  }, [updateProjects]);

  const container = useRef<HTMLDivElement>(null);
  const pdfExportComponent = useRef<PDFExport>(null);

  const exportPDFWithComponent = () => {
    if (pdfExportComponent.current) {
      pdfExportComponent.current.save();
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Disclosure as="nav" className="bg-gray-800">
        {({ open }) => (
          <>
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
              <div className="relative flex items-center justify-between h-16">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <MenuIcon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex-1 flex items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex-shrink-0 flex items-center">
                    <img
                      className="block h-8 w-auto"
                      src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
                      alt="Workflow"
                    />
                    <p className="text-white ml-2 font-bold text-3xl">Timetracker</p>
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <Menu as="div" className="ml-3 relative">
                    <div>
                      <Menu.Button className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                        <span className="sr-only">Open user menu</span>
                        <img
                          className="h-8 w-8 rounded-full"
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                          alt=""
                        />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-100"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                        <Menu.Item>
                          {({ active }) => (
                            <a
                              href="#"
                              className={classNames(active ? 'bg-gray-100' : '', 'block px-4 py-2 text-sm text-gray-700')}
                              onClick={() => {
                                localStorage.removeItem("role");
                                localStorage.removeItem("accessToken");
                                onLogout();
                              }}
                            >
                              Вийти
                            </a>
                          )}
                        </Menu.Item>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                </div>
              </div>
            </div>
          </>
        )}
      </Disclosure>
      <div className="max-w-7xl mx-auto m-10">
        <PDFExport
          ref={pdfExportComponent}
          paperSize="auto"
          margin={40}
          fileName={`Report for ${new Date().getFullYear()}`}
          author="KendoReact Team"
        >
          <div ref={container} className="for_pdf">
            <h1 className="text-3xl font-semibold mb-3">Ваші записи цього місяця</h1>
            <div className="flex flex-col">
              <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                  <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Проект
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Кількість робочих годин
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Опис роботи
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Період роботи
                          </th>
                          <th scope="col" className="relative px-6 py-3">
                            <span className="sr-only">Edit</span>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {records.map((record) => (
                          <tr key={record.recordId}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{record.projectName}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{record.workHours}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.workDescription}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.dateFrom.split("T")[0] + " / " + record.dateTo.split("T")[0]}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center">
                                <a href="#" className="text-indigo-600 hover:text-indigo-900 mr-2" onClick={() => {
                                  axios_api.post("/get_record_data", {
                                    recordId: record.recordId
                                  }).then(response => {
                                    setState({
                                      ...state, changeInput: {
                                        project: {
                                          value: response.data.projectId,
                                          label: response.data.projectName,
                                        },
                                        dateFrom: response.data.dateFrom,
                                        dateTo: response.data.dateTo,
                                        workDescription: response.data.recordDescription,
                                        workTime: response.data.workHours
                                      }, showChangeModal: true
                                    });
                                    setChangeInput(record.recordId);
                                  });
                                }}>
                                  Змінити
                                </a>{" / "}
                                <a href="#" className="text-indigo-600 hover:text-indigo-900 ml-2" onClick={() => {
                                  deleteRecord(record.recordId);
                                  setState({ ...state, showDeleteModal: true });
                                }}>
                                  <TrashIcon width="20px"></TrashIcon>
                                </a>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </PDFExport>
        <div className="flex justify-between">
          <button
            onClick={() => setState({ ...state, showAddModal: true, addInput: { ...state.addInput, project: state.projects[0] } })}
            className="w-64 mt-5 group py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Додати новий запис
          </button>
          <button
            onClick={exportPDFWithComponent}
            className="w-64 mt-5 group py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Згенерувати звіт
          </button>
        </div>
      </div>
      {state.showChangeModal ?
        <Modal
          modalType="info"
          title="Редагування звіту"
          description="Будь ласка, зробіть зміни і клацніть ОК."
          onCancel={() => {
            setState({
              ...state, showChangeModal: false, changeInput: {
                dateFrom: "",
                dateTo: "",
                project: {
                  value: "",
                  label: ""
                },
                workDescription: "",
                workTime: ""
              }
            });

            return !state.showChangeModal;
          }}
          onOK={() => {
            axios_api.post("/change_record", {
              recordId: changeInput,
              projectId: state.changeInput.project.value,
              recordDescription: state.changeInput.workDescription,
              dateFrom: state.changeInput.dateFrom,
              dateTo: state.changeInput.dateTo,
              workHours: state.changeInput.workTime
            }).then(response => {
              if (!response.data.error) {
                setUpdateRecords(true);
                setUpdateProjects(true);
              }
            });
            setState({ ...state, showChangeModal: false });

            return !state.showChangeModal;
          }}
        >
          <div className="m-6 space-y-5">
            <div>
              <p className="block font-medium text-gray-700 mb-1">Проект</p>
              <Select selected={state.changeInput.project} options={state.projects} onChange={event => setState({
                ...state,
                changeInput: {
                  ...state.changeInput, project: {
                    value: event.target.value,
                    label: state.projects.find(e => e.value === event.target.value)!.label
                  }
                }
              })} />
            </div>
            <div>
              <label htmlFor="workdescription" className="block font-medium text-gray-700 mb-1">Кількість робочих годин</label>
              <input
                value={state.changeInput.workTime}
                onChange={e => setState({ ...state, changeInput: { ...state.changeInput, workTime: e.target.value } })}
                type="number"
                min="0"
                name="workhours"
                id="workhours"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="workdescription" className="block font-medium text-gray-700 mb-1">Опис роботи</label>
              <input
                value={state.changeInput.workDescription}
                onChange={e => setState({ ...state, changeInput: { ...state.changeInput, workDescription: e.target.value } })}
                type="text"
                name="workdescription"
                id="workdescription"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div>
              <p className="block font-medium text-gray-700 mb-1">Період роботи</p>
              <div className="flex justify-between">
                <div>
                  <DatePicker selected={state.changeInput.dateFrom ? new Date(state.changeInput.dateFrom) : new Date()} onChange={(date) => setState({ ...state, changeInput: { ...state.changeInput, dateFrom: (date as Date).toISOString() } })} customInput={
                    <input type="text" name="workdate_1" id="workdate_1" className="w-56 focus:ring-indigo-500 focus:border-indigo-500 block sm:text-sm border-gray-300 rounded-md" placeholder="Початок" />
                  }></DatePicker>
                </div>
                <div>
                  <DatePicker selected={state.changeInput.dateTo ? new Date(state.changeInput.dateTo) : new Date()} onChange={(date) => setState({ ...state, changeInput: { ...state.changeInput, dateTo: (date as Date).toISOString() } })} customInput={
                    <input type="text" name="workdate_2" id="workdate_2" className="w-56 focus:ring-indigo-500 focus:border-indigo-500 block sm:text-sm border-gray-300 rounded-md" placeholder="Кінець" />
                  }></DatePicker>
                </div>
              </div>
            </div>
          </div>
        </Modal> : null}
      {state.showDeleteModal ?
        <Modal
          modalType="error"
          title="Видалення запису"
          description="Ви дійсно хочете видалити запис? Відновити буде неможливо."
          onCancel={() => {
            setState({ ...state, showDeleteModal: false });

            return !state.showDeleteModal;
          }}
          onOK={() => {
            setState({ ...state, showDeleteModal: false });
            axios_api.post("/delete_record", {
              recordId: recordToDelete
            }).then(response => {
              setState({ ...state, showDeleteModal: false });
              setUpdateRecords(true);
            });

            return !state.showDeleteModal;
          }}
        /> : null}
      {state.showAddModal ?
        <Modal
          modalType="info"
          title="Створення нового запису"
          description="Будь ласка, виберіть проект та заповніть необхідну інформацію."
          onCancel={() => {
            setState({
              ...state, showAddModal: false, addInput: {
                dateFrom: "",
                dateTo: "",
                project: {
                  value: "",
                  label: ""
                },
                workDescription: "",
                workTime: ""
              }
            });

            return !state.showAddModal;
          }}
          onOK={() => {
            axios_api.post("/add_record", {
              projectId: state.addInput.project.value,
              recordDescription: state.addInput.workDescription,
              dateFrom: state.addInput.dateFrom,
              dateTo: state.addInput.dateTo,
              workHours: state.addInput.workTime
            }).then(response => {
              if (!response.data.error) {
                setUpdateRecords(true);
                setState({ ...state, showAddModal: false, addInput: {
                  dateFrom: "",
                  dateTo: "",
                  project: {
                    value: "",
                    label: ""
                  },
                  workDescription: "",
                  workTime: ""
                } });
                setUpdateProjects(true);
              }
            });

            return !state.showAddModal;
          }}
        >
          <div className="m-6 space-y-5">
            <div>
              <p className="block font-medium text-gray-700 mb-1">Проект</p>
              <Select selected={state.addInput.project} options={state.projects} onChange={event => setState({
                ...state,
                addInput: {
                  ...state.addInput, project: {
                    value: event.target.value,
                    label: state.projects.find(e => e.value === event.target.value)!.label
                  }
                }
              })} />
            </div>
            <div>
              <label htmlFor="workdescription" className="block font-medium text-gray-700 mb-1">Кількість робочих годин</label>
              <input
                value={state.addInput.workTime}
                onChange={e => setState({ ...state, addInput: { ...state.addInput, workTime: e.target.value } })}
                type="number"
                min="0"
                name="workhours"
                id="workhours"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="workdescription" className="block font-medium text-gray-700 mb-1">Опис роботи</label>
              <input
                value={state.addInput.workDescription}
                onChange={e => setState({ ...state, addInput: { ...state.addInput, workDescription: e.target.value } })}
                type="text"
                name="workdescription"
                id="workdescription"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div>
              <p className="block font-medium text-gray-700 mb-1">Період роботи</p>
              <div className="flex justify-between">
                <div>
                  <DatePicker
                    selected={state.addInput.dateFrom ? new Date(state.addInput.dateFrom) : new Date()}
                    onChange={(date) => setState({
                      ...state, addInput: {
                        ...state.addInput, dateFrom: (date as Date).toISOString()
                      }
                    })}
                    customInput={
                      <input type="text" name="workdate_1" id="workdate_1" className="w-56 focus:ring-indigo-500 focus:border-indigo-500 block sm:text-sm border-gray-300 rounded-md" placeholder="Початок" />
                    }
                  />
                </div>
                <div>
                  <DatePicker
                    selected={state.addInput.dateTo ? new Date(state.addInput.dateTo) : new Date()}
                    onChange={(date) => setState({ ...state, addInput: { ...state.addInput, dateTo: (date as Date).toISOString() } })}
                    customInput={
                      <input type="text" name="workdate_2" id="workdate_2" className="w-56 focus:ring-indigo-500 focus:border-indigo-500 block sm:text-sm border-gray-300 rounded-md" placeholder="Кінець" />
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </Modal> : null}
    </div>
  );
};

export default UserDashboard;