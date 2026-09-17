import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaTachometerAlt, FaFileInvoice, FaMoneyBill,
  FaClipboard, FaDatabase, FaTruckMoving, FaMailBulk, FaUserFriends, 
  FaList, FaChevronDown, FaChevronRight, FaChevronLeft, FaPrint, FaInbox, FaWarehouse, 
  FaTrash, FaTasks,  FaCaretRight, FaThList, FaPen} from "react-icons/fa";
  import { TiArrowRight , TiArrowLeft   } from "react-icons/ti";
import './Sidebar.css';

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [isPinned, setIsPinned] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [role, setRole] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);

  const toggleSidebar = () => {
    setIsPinned(!isPinned);
    setIsSidebarOpen(!isPinned);
  };

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const roleBasedLinks = {

    // anand____divine

    admin: [
      { name: "Dashboard", path: "/Dashboard", icon: <FaTachometerAlt /> },
      { name: "Add Product", path: "/addproduct", icon: <FaMoneyBill /> },
      { name: "Product List", path: "/listproduct", icon: <FaList /> },
      { name: "Client Orders", path: "/ClintOrders", icon: <FaTruckMoving /> },
      { name: "Upload Files", path: "/uploadfile", icon: <FaFileInvoice /> },
      { name: "Manage Files", path: "/managefiles", icon: <FaClipboard /> },
      { name: "Stocks Lists", path: "/Products", icon: <FaDatabase /> },    

      {
        name: "Divine IT PNG  Billings",
        icon: <FaMailBulk />,
       children: [
          { name: "Invoices", path: "/SkylapitInvoice", icon: <FaInbox /> },
          { name: "Billing", path: "/SkylapitBilling", icon: <FaPrint /> },
          { name: "Acknowledgement Receipt", path: "/Skylapitreceipt", icon: <FaClipboard /> },
          { name: "Receipt List", path: "/SkylapitReceiptList", icon: <FaClipboard /> },
          { name: "Customers", path: "/SkylapitCustomers", icon: <FaUserFriends /> },
          { name: "Divine IT PNG Trash", path: "/SkylapitTrash", icon: <FaTrash /> },
          { name: "Divine IT PNG StockManagement", path: "/SkylapitStockManagement", icon: <FaWarehouse /> },
          { name: "Divine IT PNG  Task", path: "/SkylapitTask", icon: <FaTasks /> },
          { name: "Divine IT PNG  Create Task", path: "/SkylapitCreateTask", icon: <FaTasks /> },
          { name: "Create Po", path: "/CreatePo", icon: <FaCaretRight /> },
          { name: "Po Trash", path: "/SkylapitPoTrash", icon: <FaTrash /> },
          { name: "Acknowledgement Receipt Trash", path: "/SkylapitReceiptTrash", icon: <FaTrash /> },
        ],
      },     
           
    ],

// arya 
    manager: [
      { name: "Dashboard", path: "/JerishConstructionDashboard", icon: <FaTachometerAlt /> },
      { name: "stockManagement", path: "/JerishConstructionStockManagement", icon: <FaWarehouse  /> },
      { name: "Trash", path: "/JerishConstructionTrash", icon: <FaTrash  /> },

      {
        name: "Billings",
        icon: <FaDatabase />,
        children: [
          { name: "Billing", path: "/JerishConstructionbilling", icon: <FaPrint /> },
          { name: "Invoice", path: "/JerishConstructionInvoice", icon: <FaInbox /> },
          { name: "Customers", path: "/JerishConstructionCustomers", icon: <FaUserFriends /> },

        ],
      },

     

    ],

    //Aryamama
    
    staff: [
      { name: "Dashboard", path: "/SkylapitDashboard", icon: <FaTachometerAlt /> },
      { name: "Stocks", path: "/SkylapitStockManagement", icon: <FaWarehouse  /> },
      { name: "Products", path: "/Products", icon: <FaDatabase /> },
      { name: "Customers", path: "/SkylapitCustomers", icon: <FaUserFriends /> },
 
       

      {
        name: "Tasks",
        icon: <FaTasks/>,
        children: [
          { name: "CreateTasks", path: "/SkylapitCreateTask", icon: <FaPen />},
          { name: "Task", path: "/SkylapitTask", icon: <FaTasks />},  
          { name: "Trash", path: "/SkylapitTaskTrash", icon: <FaTrash />},  

        ]
      },

      {
        name: "Billings",
        icon: <FaMailBulk />,
        children: [
          { name: "Billing", path: "/SkylapitBilling", icon: <FaPrint /> },
          { name: "Invoices", path: "/SkylapitInvoice", icon: <FaFileInvoice /> },            
          { name: "Trash", path: "/SkylapitTrash", icon: <FaTrash  /> },
        ],
      },

      {
        name: "PO Manage",
        icon: <FaCaretRight/>,
        children: [
            { name: "Create Po", path: "/SkylapitCreatePo", icon: <FaPrint/>},
            { name: "Po lists", path: "/SkylapitManagePos", icon: <FaThList/>},
            { name: "Po Trash", path: "/SkylapitPoTrash", icon: <FaTrash/>},
        ],
      },
     
    ],

    
    
   

  };

 
  const allowedLinks = roleBasedLinks[role] || [];
  const showLabels = isPinned || isHovered || isSidebarOpen;
  const getLinkClasses = ({ isActive }) =>
    `group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
      isActive
        ? "bg-[linear-gradient(135deg,rgba(15,118,110,0.22),rgba(192,137,47,0.22))] text-white shadow-[0_14px_30px_rgba(0,0,0,0.18)]"
        : "text-stone-200 hover:bg-white/10 hover:text-white"
    }`;

  return (
    
    <aside
    className={` fixed left-0 top-0 bottom-0 h-screen font-poppins 
    transition-all duration-300 z-50
    ${isPinned ? "w-72" : isHovered ? "w-72" : "w-20"}
    overflow-visible
    border-r border-white/10
    bg-[linear-gradient(180deg,#11211f_0%,#0b1514_45%,#081211_100%)]
    text-white shadow-[0_24px_60px_rgba(0,0,0,0.35)]`}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
  >  
      {/* Toggle Button */}
     <button
  onClick={toggleSidebar}
  className="absolute top-5 -right-5 z-[100]
  flex h-9 w-9 items-center justify-center
  rounded-full
  bg-white/10 backdrop-blur-xl
  border border-white/20
  text-black
  shadow-[0_8px_20px_rgba(0,0,0,0.18)]
  transition duration-200 hover:scale-105"
  aria-label={isPinned ? "Collapse sidebar" : "Expand sidebar"}
>
  {isPinned ? <TiArrowLeft size={22} /> : <TiArrowRight size={22} />}
</button>

      <div className="h-full overflow-y-auto custom-scrollbar p-4 flex flex-col justify-between">

      <div className="mb-8 mt-2 overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#d7a348,#0f766e)] text-sm font-bold text-white shadow-lg">
            LU
          </div>
          {showLabels && (
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-amber-200/80">Admin Panel</p>
              <h1 className="text-lg font-semibold text-white">Skylap IT Solutions</h1>
            </div>
          )}
        </div>
      </div>

      <ul className="flex-1 space-y-2">
        {allowedLinks.map((link) => (
          <li key={link.name}>
            {link.children ? (
              <div
                onClick={() => toggleDropdown(link.name)}
                className="flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-stone-200 transition-all duration-200 hover:bg-white/10 hover:text-white"
              >
                <span className="text-lg text-amber-200">{link.icon}</span>
                {showLabels && (
                  <>
                    <span className="flex-1">{link.name}</span>
                    {openDropdown === link.name ? <FaChevronDown /> : <FaChevronRight />}
                  </>
                )}
              </div>
            ) : (
              <NavLink to={link.path} className={getLinkClasses}>
                <span className="text-lg text-amber-200 transition-transform duration-200 group-hover:scale-110">{link.icon}</span>
                {showLabels && <span>{link.name}</span>}
              </NavLink>
            )}

            {/* Dropdown Links */}
            {link.children && openDropdown === link.name && (
              <ul className="ml-4 mt-2 space-y-2 border-l border-white/10 pl-4">
                {link.children.map((child) => (
                  <li key={child.name}>
                    <NavLink
                      to={child.path}
                      className={getLinkClasses}
                    >
                      <span className="text-lg text-amber-200 transition-transform duration-200 group-hover:scale-110">{child.icon}</span>
                      {showLabels && <span>{child.name}</span>}
                    </NavLink>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      {showLabels && (
        <div className="mt-6 rounded-[24px] border border-white/10 bg-white/5 p-4 text-xs leading-5 text-stone-300">
          <p className="uppercase tracking-[0.22em] text-amber-200/80">Workspace</p>
          <p className="mt-2">Billing, dashboard, product, and task screens can now be styled locally without changing the whole app.</p>
        </div>
      )}

      </div>
    </aside>
  );
};

export default Sidebar;
