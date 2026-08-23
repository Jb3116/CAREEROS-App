import React from 'react';

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = '', children, ...props }) => (
  <aside className={`sidebar ${className}`} {...props}>
    {children}
  </aside>
);

export const SidebarHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', children, ...props }) => (
  <div className={`sidebar-header ${className}`} {...props}>
    {children}
  </div>
);

export const SidebarContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', children, ...props }) => (
  <div className={`sidebar-nav ${className}`} {...props}>
    {children}
  </div>
);

export const SidebarGroup: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', children, ...props }) => (
  <div className={`sidebar-group ${className}`} {...props}>
    {children}
  </div>
);

export const SidebarGroupLabel: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', children, ...props }) => (
  <div className={`sidebar-group-label ${className}`} {...props}>
    {children}
  </div>
);

export const SidebarMenu: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', children, ...props }) => (
  <div className={`sidebar-menu ${className}`} {...props}>
    {children}
  </div>
);

export const SidebarMenuItem: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', children, ...props }) => (
  <div className={`sidebar-menu-item ${className}`} {...props}>
    {children}
  </div>
);

export interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isActive?: boolean;
  tooltip?: string;
}

export const SidebarMenuButton: React.FC<SidebarMenuButtonProps> = ({
  isActive,
  tooltip,
  className = '',
  children,
  ...props
}) => (
  <button className={`nav-item ${isActive ? 'active' : ''} ${className}`} {...props}>
    {children}
    {tooltip && <span className="nav-tooltip">{tooltip}</span>}
  </button>
);

export const SidebarFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ className = '', children, ...props }) => (
  <div className={`sidebar-footer ${className}`} {...props}>
    {children}
  </div>
);

export default Sidebar;
