import "./AccountantDashboard.css";
import { Fragment, useEffect, useState } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { MenuIcon, XIcon, TrashIcon } from '@heroicons/react/outline';
import { UserAddIcon, CashIcon, ChartPieIcon, UserIcon } from '@heroicons/react/solid';
import Modal from "../components/Modal";
import Select from "../components/Select";
import axios_api from "../axios/axios";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const options = [
  {
    value: "test1",
    label: "123"
  },
  {
    value: "test2",
    label: "321"
  },
  {
    value: "test3",
    label: "421414"
  },
  {
    value: "test4",
    label: "32dsadsada1"
  },
  {
    value: "test5",
    label: "612561"
  }
];

const AccountantDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [state, setState] = useState({
    showRegisterModal: false,
    showCalcSalaryModal: false,
    showStatsModal: false,
    showRegisteredUsersModal: false
  });

  const [projects, setProjects] = useState([{
    label: "",
    value: ""
  }]);

  const [isUpdatedProjects, setIsUpdatedProjects] = useState(false);
  const [isUpdatedUsers, setIsUpdatedUsers] = useState(false);

  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    password: "",
    project: projects[0]
  });

  const [selectedUserForCalc, setSelectedUserForCalc] = useState({
    value: "",
    label: ""
  });
  const [selectedProjectForCalc, setSelectedProjectForCalc] = useState({
    value: "",
    label: ""
  });

  const [users, setUsers] = useState<{
    id: string;
    fullName: string;
    email: string;
    projectName: string;
  }[]>([]);

  const [userSalary, setUserSalary] = useState(0.0);

  useEffect(() => {
    axios_api.get("/get_users").then(response => {
      if (!isUpdatedUsers) {
        setUsers(response.data);
        setIsUpdatedUsers(true);
      }
    });
  }, [users]);

  useEffect(() => {
    axios_api.get("/get_projects").then(response => {
      if (!isUpdatedProjects) {
        setProjects(response.data.map((project: { id: any; projectName: any; }) => ({
          value: project.id,
          label: project.projectName
        })));
        setNewUser({ ...newUser, project: projects[0] });
        setIsUpdatedProjects(true);
      }
    });
  }, [projects]);

  useEffect(() => {
    axios_api.post("/get_user_salary", {
      userId: selectedUserForCalc.value,
      projectId: selectedProjectForCalc.value
    }).then(response => {
      setUserSalary(response.data.salary);
    });
  }, [selectedProjectForCalc, selectedUserForCalc]);

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
        <div className="w-full bg-white rounded shadow-lg p-10">
          <div className="flex flex-wrap justify-between -m-2 items-center">
            <div className="border rounded p-5 m-2 w-96 h-64 flex flex-col items-center justify-between hover:bg-gray-50">
              <UserAddIcon width="64px" />
              <div>
                <p className="text-center leading-5 mb-3">Тут можна зареєструвати нового працівника та вибрати йому потрібний проект.</p>
                <button
                  onClick={() => {
                    setState({ ...state, showRegisterModal: true });
                    setNewUser({
                      fullName: "",
                      email: "",
                      password: "",
                      project: projects[0]
                    });
                    setIsUpdatedProjects(false);
                  }}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Зареєструвати нового працівника
                </button>
              </div>
            </div>
            <div className="border rounded p-5 m-2 w-96 h-64 flex flex-col items-center justify-between">
              <CashIcon width="64px" />
              <div>
                <p className="text-center leading-5 mb-3">Обрахунок заробітної плати працівника по вибраному проект.</p>
                <button
                  onClick={() => {
                    setState({ ...state, showCalcSalaryModal: true });
                    setIsUpdatedUsers(false);
                    setSelectedUserForCalc({
                      value: users[0].id,
                      label: users[0].fullName
                    });
                    setSelectedProjectForCalc(projects[0]);
                  }}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Обрахувати заробітню плату
                </button>
              </div>
            </div>
            <div className="border rounded p-5 m-2 w-96 h-64 flex flex-col items-center justify-between">
              <UserIcon width="64px" />
              <div>
                <p className="text-center leading-5 mb-3">Необхідний список працівників? Клікніть на кнопку нижче.</p> 
                <button
                  onClick={() => setState({ ...state, showRegisteredUsersModal: true })}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  Список зареєстрованих працівників
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {state.showRegisterModal ?
        <Modal
          modalType="info"
          title="Реєстрація нового працівника"
          description="Будь ласка, заповніть необхідну інформацію."
          onCancel={() => { 
            setState({ ...state, showRegisterModal: false }); 

            return !state.showRegisterModal; 
          }}
          onOK={() => { 
            axios_api.post("/register", {
              fullName: newUser.fullName,
              email: newUser.email,
              password: newUser.password,
              projectId: newUser.project.value
            }).then(response => {
              setState({ ...state, showRegisterModal: false }); 
            });
            
            return !state.showRegisterModal; 
          }}
        >
          <div className="m-6 space-y-5">
            <div>
              <label htmlFor="fullname" className="block font-medium text-gray-700 mb-1">Повне ім'я працівника (ПІБ)</label>
              <input value={newUser.fullName} onChange={e => setNewUser({ ...newUser, fullName: e.target.value })} type="text" name="fullname" id="fullname" className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" autoComplete="name" required />
            </div>
            <div>
              <label htmlFor="email" className="block font-medium text-gray-700 mb-1">Поштова скринька</label>
              <input value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} type="text" name="email" id="email" className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" autoComplete="email" required />
            </div>
            <div>
              <label htmlFor="password" className="block font-medium text-gray-700 mb-1">Пароль</label>
              <input value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} minLength={8} type="text" name="password" id="password" className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" />
            </div>
            <div>
              <p className="block font-medium text-gray-700 mb-1">Проект</p>
              <Select selected={newUser.project} options={projects} onChange={event => setNewUser({ ...newUser,
                project: {
                  value: event.target.value, 
                  label: projects.find(e => e.value === event.target.value)!.label 
                }
              })}/>
            </div>
          </div>
        </Modal> : null}
      {state.showCalcSalaryModal ?
        <Modal
          modalType="info"
          title="Обрахунок заробітної плати"
          description="Будь ласка, виберіть працівника і його проект для обрахування заробітної плати."
          onCancel={() => { 
            setState({ ...state, showCalcSalaryModal: false }); 
            setSelectedUserForCalc({
              value: "",
              label: ""
            });
            
            return !state.showCalcSalaryModal; 
          }}
          onOK={() => { 
            setState({ ...state, showCalcSalaryModal: false }); 
            setSelectedUserForCalc({
              value: "",
              label: ""
            });
            
            return !state.showCalcSalaryModal; 
          }}
        >
          <div className="m-6 space-y-5">
            <div>
              <p className="block font-medium text-gray-700 mb-1">Працівник</p>
              <Select 
                selected={selectedUserForCalc} 
                options={users.map(user => ({
                  value: user.id,
                  label: user.fullName
                }))} 
                onChange={event => {
                  setSelectedUserForCalc({
                    value: event.target.value,
                    label: users.find(e => e.id === event.target.value)!.fullName
                  });
                }}
              />
            </div>
            <div>
              <p className="block font-medium text-gray-700 mb-1">Проект</p>
              <Select selected={selectedProjectForCalc} options={projects} onChange={event => {
                setSelectedProjectForCalc({
                  value: event.target.value,
                  label: projects.find(e => e.value === event.target.value)!.label
                });
              }}/>
            </div>
            {selectedUserForCalc.value 
              ? <div>
                  <p>Заробітна плата за цей місяць: ${userSalary}</p>
                </div>
              : null
            }
          </div>
        </Modal> : null}
      {state.showRegisteredUsersModal ?
        <Modal
          modalType="info"
          title="Зареєстровані працівники"
          description="В даній таблиці відображаються всі зареєстровані працівники."
          onCancel={() => { setState({ ...state, showRegisteredUsersModal: false }); return true; }}
          onOK={() => { setState({ ...state, showRegisteredUsersModal: false }); return true; }}
        >
          <div className="m-6 space-y-5">
            <div className="overflow-auto">
              <table className="table-fixed">
                <thead>
                  <tr>
                    <th className="w-1/3">ПІБ</th>
                    <th className="w-1/3">E-mail</th>
                    <th className="w-1/3">Проект</th>
                  </tr>
                </thead>
                <tbody>
                {users.map(user => (
                  <tr>
                    <td>{user.fullName}</td>
                    <td>{user.email}</td>
                    <td>{user.projectName}</td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
        </Modal> : null}
    </div>
  );
};

export default AccountantDashboard;