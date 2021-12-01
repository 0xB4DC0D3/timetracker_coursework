import "./AccountantDashboard.css";
import { Fragment, useState } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { MenuIcon, XIcon } from '@heroicons/react/outline';
import { CashIcon, UserAddIcon, NewspaperIcon } from "@heroicons/react/solid";
import axios_api from "../axios/axios";
import Modal from "../components/Modal";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}

const AdminDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [state, setState] = useState({
    showRegProjDialog: false,
    showRegAccDialog: false
  });

  const [projectInput, setProjectInput] = useState("");
  const [projectPaymentInput, setProjectPaymentInput] = useState("");
  const [fullNameInput, setFullNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");

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
          <div className="flex flex-wrap justify-around -m-2 items-center">
            <div className="border rounded p-5 m-2 w-96 h-64 flex flex-col items-center justify-between hover:bg-gray-50">
              <NewspaperIcon width="64px" />
              <div>
                <p className="text-center leading-5 mb-3">Тут можна зареєструвати новий проект.</p>
                <button
                  onClick={() => {
                    setState({ ...state, showRegProjDialog: true });
                  }}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Зареєструвати новий проект
                </button>
              </div>
            </div>
            <div className="border rounded p-5 m-2 w-96 h-64 flex flex-col items-center justify-between">
              <CashIcon width="64px" />
              <div>
                <p className="text-center leading-5 mb-3">В даному блоці ви можете зареєструвати бухгалтерів.</p>
                <button
                  onClick={() => {
                    setState({ ...state, showRegAccDialog: true });
                  }}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Зареєструвати нового бухгалтера
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {state.showRegProjDialog ? 
        <Modal
          modalType="info"
          title="Реєстрація нового проекту"
          description="Будь ласка, заповніть необхідну інформацію."
          onCancel={() => { 
            setState({ ...state, showRegProjDialog: false }); 

            return !state.showRegProjDialog; 
          }}
          onOK={() => { 
            axios_api.post("/register_project", {
              projectName: projectInput,
              payment: projectPaymentInput
            }).then(response => {
              if (!response.data.error) 
                setState({ ...state, showRegProjDialog: false }); 
            });
            
            return !state.showRegProjDialog; 
          }}
        >
          <div className="m-6 space-y-5">
            <div>
              <label htmlFor="fullname" className="block font-medium text-gray-700 mb-1">Назва проекту</label>
              <input value={projectInput} onChange={e => setProjectInput(e.target.value)} type="text" name="project_name" id="project_name" className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" required />
              <label htmlFor="fullname" className="block font-medium text-gray-700 mb-1">Оплата за годину</label>
              <input value={projectPaymentInput} onChange={e => setProjectPaymentInput(e.target.value)} type="text" name="project_name" id="project_name" className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" required />
            </div>
          </div>
        </Modal> : null}
        {state.showRegAccDialog ?
        <Modal
          modalType="info"
          title="Реєстрація нового бухгалтера"
          description="Будь ласка, заповніть необхідну інформацію."
          onCancel={() => { 
            setState({ ...state, showRegAccDialog: false }); 

            return !state.showRegAccDialog; 
          }}
          onOK={() => { 
            axios_api.post("/register", {
              fullName: fullNameInput,
              email: emailInput,
              password: passwordInput,
              isAccountant: true
            }).then(response => {
              setState({ ...state, showRegAccDialog: false }); 
            });
            
            return !state.showRegAccDialog; 
          }}
        >
          <div className="m-6 space-y-5">
            <div>
              <label htmlFor="fullname" className="block font-medium text-gray-700 mb-1">Повне ім'я бухгалтера (ПІБ)</label>
              <input value={fullNameInput} onChange={e => setFullNameInput(e.target.value)} type="text" name="fullname" id="fullname" className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" autoComplete="name" required />
            </div>
            <div>
              <label htmlFor="email" className="block font-medium text-gray-700 mb-1">Поштова скринька</label>
              <input value={emailInput} onChange={e => setEmailInput(e.target.value)} type="text" name="email" id="email" className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" autoComplete="email" required />
            </div>
            <div>
              <label htmlFor="password" className="block font-medium text-gray-700 mb-1">Пароль</label>
              <input value={passwordInput} onChange={e => setPasswordInput(e.target.value)} minLength={8} type="text" name="password" id="password" className="focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md" />
            </div>
          </div>
        </Modal> : null}
    </div>
  );
};

export default AdminDashboard;