



import React, { useState, useEffect, useCallback, useMemo, useRef, CSSProperties, FC, ReactNode } from 'react';
import { Product, CartItem, Testimonial, WishlistItem, DeliveryDetails, Order, LiveSale, TeamMember } from './types';
import { CATEGORIES, WHATSAPP_NUMBER, SHIPPING_COST, DELIVERY_LOCATIONS, INSTAGRAM_HANDLE, TESTIMONIALS, COMPANY_EMAIL, FACEBOOK_HANDLE, X_HANDLE, CAREERS_EMAIL, TEAM_MEMBERS, LINKEDIN_HANDLE } from './constants';
import { generateProductsForCategory, searchProducts } from './services/geminiService';
import { LOCAL_PRODUCTS } from './data';

// --- TYPES ---
type View = 'home' | 'products' | 'cart' | 'checkout' | 'orderConfirmation' | 'wishlist' | 'aboutUs' | 'customerFeedbackPage' | 'helpCenter' | 'fridayOffers' | 'careers' | 'search' | 'contactUs';

interface ToastMessage {
    id: number;
    message: string;
    type: 'success' | 'error';
}

// --- HOOKS ---
function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

// --- UTILS ---
const formatCurrency = (amount: number) => {
  if (amount === 0) return 'Free';
  return `Ksh ${amount.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
};

// --- ICONS ---
const FireIcon: FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
    <path fillRule="evenodd" d="M11.728 2.433a.75.75 0 01.846 1.06l-5.25 7.5a.75.75 0 01-1.24-.658l1.5-6.75a.75.75 0 01.917-.652l3.227.717ZM13.813 9.406a.75.75 0 01.288 1.294l-5.25 3a.75.75 0 01-1.127-.852l2.25-6.75a.75.75 0 011.372.464l-1.48 4.437 3.947-2.256Z" clipRule="evenodd" />
    <path d="M15.75 10.5a.75.75 0 01-.75.75H8.25a.75.75 0 010-1.5h6.75a.75.75 0 01.75.75Z" />
  </svg>
);

const UserIcon: FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || 'w-6 h-6'}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
);

const CartIcon: FC<{ className?: string, style?: CSSProperties }> = ({ className, style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || 'w-6 h-6'} style={style}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c.51 0 .962-.328 1.125-.821l2.853-5.706a.75.75 0 0 0-.01-1.022l-1.07-1.071-4.243 3.565-1.68-1.682a4.5 4.5 0 0 0-6.364 0l-1.07 1.071-1.07-1.071a4.5 4.5 0 0 0-6.364 0l-1.07 1.071-2.853 5.706A.75.75 0 0 0 2.25 9.75l2.091 4.5M7.5 14.25h11.218" />
  </svg>
);

const HeartIcon: FC<{ className?: string, isFilled?: boolean }> = ({ className, isFilled }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill={isFilled ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || 'w-6 h-6'}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
  </svg>
);

const MagnifyingGlassIcon: FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || 'w-6 h-6'}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

const Bars3Icon: FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || 'w-6 h-6'}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
  </svg>
);

const XMarkIcon: FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || 'w-6 h-6'}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
);

const ArrowLeftIcon: FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || 'w-6 h-6'}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
);

const ChevronDownIcon: FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || 'w-6 h-6'}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
    </svg>
);

const CheckCircleIcon: FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
  </svg>
);

const ExclamationCircleIcon: FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || 'w-6 h-6'}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
    </svg>
);

const TrashIcon: FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-5 h-5"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
  </svg>
);

const PlusIcon: FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
  </svg>
);

const MinusIcon: FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
    <path fillRule="evenodd" d="M4 10a.75.75 0 01.75-.75h10.5a.75.75 0 010 1.5H4.75A.75.75 0 014 10z" clipRule="evenodd" />
  </svg>
);

const PhoneIcon: FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className || "w-5 h-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.211-.998-.584-1.35l-3.952-3.952a1.125 1.125 0 0 0-1.591 0L14.25 10.5l-5.25-5.25 1.409-1.409a1.125 1.125 0 0 0 0-1.591L6.343 1.5H5.25A2.25 2.25 0 0 0 3 3.75v1.5Z" />
    </svg>
);

const EnvelopeIcon: FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className={className || "w-5 h-5"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25-2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
    </svg>
);

const WhatsAppIcon: FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="currentColor" viewBox="0 0 24 24">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.894 11.892-1.99 0-3.903-.52-5.586-1.456l-6.315 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.886-.001 2.269.654 4.385 1.907 6.18l-1.299 4.745 4.833-1.276zM9.356 8.014c-.099-.148-.233-.148-.347-.148s-.525.244-.638.392c-.112.148-.232.469-.232.936s.233 1.05.257 1.118c.024.068.502 1.152 1.479 1.926 1.282 1.04 1.547.922 1.848.831s1.299-.532 1.481-.994c.182-.462.182-.85.112-.936s-.21-.118-.347-.215c-.138-.099-.867-.433-1.002-.48s-.233-.07-.347.07c-.113.148-.391.48-.48.577s-.182.118-.32.07c-.137-.049-.577-.233-.954-.607-.297-.282-.532-.607-.607-.753s-.07-.233.023-.324c.099-.099.21-.257.32-.368s.162-.182.232-.3.024-.282-.049-.37Z"/>
    </svg>
);

const GiftIcon: FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || 'w-6 h-6'}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.375a9.75 9.75 0 0 1-8.15-4.425m16.3 0a9.75 9.75 0 0 0-8.15-4.425m0 0V3.75m0 3.75a3.75 3.75 0 0 0-3.75 3.75M12 7.5v1.5M12 7.5a3.75 3.75 0 0 1 3.75 3.75m-7.5 0H12m0 0h3.75m-3.75 0a3.75 3.75 0 0 1-3.75 3.75m0 0V15m3.75-3.75v1.5m0 0a3.75 3.75 0 0 0 3.75 3.75M12 15v-1.5m0 0h3.75" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a2.25 2.25 0 0 1-2.25 2.25H5.25a2.25 2.25 0 0 1-2.25-2.25v-8.25" />
    </svg>
);

const StarIcon: FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className || "w-5 h-5"}>
    <path fillRule="evenodd" d="M10.868 2.884c.321-.662 1.134-.662 1.456 0l2.122 4.394 4.848.705c.73.106 1.02.998.494 1.503l-3.508 3.419.828 4.83c.125.728-.638 1.283-1.296.952L10 15.11l-4.328 2.276c-.658.33-1.422-.224-1.296-.952l.828-4.83-3.508-3.419c-.526-.505-.236-1.397.494-1.503l4.848-.705L9.132 2.884h1.736Z" clipRule="evenodd" />
  </svg>
);

const InstagramIcon: FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919C8.416 2.175 8.796 2.163 12 2.163zm0 1.44c-3.116 0-3.483.01-4.702.067-2.61.12-3.834 1.344-3.954 3.954C3.284 8.517 3.273 8.884 3.273 12s.01 3.483.067 4.702c.12 2.61 1.344 3.834 3.954 3.954 1.219.056 1.586.067 4.702.067s3.483-.01 4.702-.067c2.61-.12 3.834-1.344 3.954-3.954.056-1.219.067-1.586.067-4.702s-.01-3.483-.067-4.702c-.12-2.61-1.344-3.834-3.954-3.954C15.483 3.613 15.116 3.603 12 3.603z"/>
        <path d="M12 6.865c-2.833 0-5.135 2.302-5.135 5.135s2.302 5.135 5.135 5.135 5.135-2.302 5.135-5.135S14.833 6.865 12 6.865zm0 8.81c-2.028 0-3.675-1.647-3.675-3.675s1.647-3.675 3.675-3.675 3.675 1.647 3.675 3.675-1.647 3.675-3.675 3.675z"/>
        <path d="M16.949 6.012c-.527 0-.954.427-.954.954s.427.954.954.954.954-.427.954-.954-.427-.954-.954-.954z"/>
    </svg>
);

const FacebookIcon: FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="currentColor" viewBox="0 0 24 24">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>
    </svg>
);

const XIcon: FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
    </svg>
);

const LinkedInIcon: FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-6 w-6"} fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
);

// --- COMPONENTS ---

const Toast: FC<ToastMessage & { onDismiss: (id: number) => void }> = ({ id, message, type, onDismiss }) => {
    useEffect(() => {
        const timer = setTimeout(() => onDismiss(id), 5000);
        return () => clearTimeout(timer);
    }, [id, onDismiss]);

    const isSuccess = type === 'success';

    return (
        <div className={`flex items-center w-full max-w-xs p-4 space-x-4 rtl:space-x-reverse text-gray-500 bg-white rounded-lg shadow-lg ${isSuccess ? 'text-green-800' : 'text-red-800'} dark:text-gray-400 dark:bg-gray-800`} role="alert">
            <div className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 ${isSuccess ? 'text-green-500 bg-green-100 dark:bg-green-800 dark:text-green-200' : 'text-red-500 bg-red-100 dark:bg-red-800 dark:text-red-200'} rounded-lg`}>
                {isSuccess ? <CheckCircleIcon className="w-5 h-5" /> : <ExclamationCircleIcon className="w-5 h-5" />}
                <span className="sr-only">{isSuccess ? 'Check' : 'Error'} icon</span>
            </div>
            <div className="ms-3 text-sm font-normal">{message}</div>
            <button type="button" className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700" onClick={() => onDismiss(id)} aria-label="Close">
                <span className="sr-only">Close</span>
                <XMarkIcon className="w-5 h-5" />
            </button>
        </div>
    );
};


const ToastContainer: FC<{ toasts: ToastMessage[], onDismiss: (id: number) => void }> = ({ toasts, onDismiss }) => (
    <div className="fixed top-5 right-5 z-50 space-y-4">
        {toasts.map(toast => <Toast key={toast.id} {...toast} onDismiss={onDismiss} />)}
    </div>
);

const LoadingSpinner: FC = () => (
    <div className="flex justify-center items-center p-10">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500"></div>
    </div>
);

const BackButton: FC<{ onBack: () => void }> = ({ onBack }) => (
    <button onClick={onBack} className="flex items-center text-orange-600 font-semibold mb-6 hover:underline">
        <ArrowLeftIcon className="w-5 h-5 mr-2" />
        Back
    </button>
);

const ProductCard: FC<{
    product: Product;
    onViewDetails: (product: Product) => void;
    onAddToCart: (product: Product) => void;
    onAddToWishlist: (product: Product) => void;
    wishlist: WishlistItem[];
}> = ({ product, onViewDetails, onAddToCart, onAddToWishlist, wishlist }) => {
    const isWishlisted = useMemo(() => wishlist.some(item => item.id === product.id), [wishlist, product.id]);
    const discount = product.originalPrice > product.price 
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
            <div className="relative">
                <div onClick={() => onViewDetails(product)} className="cursor-pointer">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-48 object-cover" />
                </div>
                <button
                    onClick={() => onAddToWishlist(product)}
                    className={`absolute top-2 right-2 p-2 rounded-full transition-colors ${isWishlisted ? 'bg-red-500 text-white' : 'bg-white/70 text-gray-700 hover:bg-white'}`}
                    aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                >
                    <HeartIcon className="w-5 h-5" isFilled={isWishlisted} />
                </button>
                {discount > 0 && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                        -{discount}%
                    </div>
                )}
            </div>
            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-semibold text-gray-800 truncate cursor-pointer" onClick={() => onViewDetails(product)} title={product.name}>{product.name}</h3>
                <p className="text-sm text-gray-500 mt-1 flex-grow">{product.description}</p>
                
                <div className="mt-2 text-xs text-gray-400">
                    {product.timesOrdered && (<span>{product.timesOrdered.toLocaleString()} sold</span>)}
                </div>
                
                <div className="mt-4 flex-grow-0">
                    <div className="flex items-baseline gap-2">
                         <p className="text-xl font-bold text-gray-900">{formatCurrency(product.price)}</p>
                         {discount > 0 && (
                             <p className="text-sm text-gray-500 line-through">{formatCurrency(product.originalPrice)}</p>
                         )}
                    </div>
                    <button
                        onClick={() => onAddToCart(product)}
                        className="w-full mt-3 bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600 transition-colors"
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

const ProductDetailModal: FC<{
    product: Product;
    onClose: () => void;
    onAddToCart: (product: Product) => void;
}> = ({ product, onClose, onAddToCart }) => {
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = useCallback(() => {
        setIsClosing(true);
        setTimeout(onClose, 300);
    }, [onClose]);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        }
    }, [handleClose]);

    const discount = product.originalPrice > product.price 
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;
    
    return (
        <div className={`fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`} onClick={handleClose}>
            <div 
                className={`bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden transition-transform duration-300 ${isClosing ? 'scale-95' : 'scale-100'}`}
                onClick={e => e.stopPropagation()}
            >
                <div className="md:w-1/2">
                    <img src={product.imageUrl} alt={product.name} className="w-full h-64 md:h-full object-cover" />
                </div>
                <div className="md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
                    <div className="flex-grow">
                        <div className="flex justify-between items-start">
                            <h2 className="text-3xl font-bold text-gray-800">{product.name}</h2>
                            <button onClick={handleClose} className="p-2 -mr-2 -mt-2 text-gray-400 hover:text-gray-800"><XMarkIcon className="w-6 h-6"/></button>
                        </div>
                         {product.timesOrdered && (
                            <p className="text-sm text-gray-500 mt-2">{product.timesOrdered.toLocaleString()} sold</p>
                        )}
                        <p className="text-gray-600 mt-4 text-base">{product.longDescription}</p>
                    </div>
                    <div className="mt-6 pt-6 border-t">
                        <div className="flex items-baseline gap-2">
                            <p className="text-4xl font-extrabold text-orange-600">{formatCurrency(product.price)}</p>
                            {discount > 0 && (
                                <p className="text-xl text-gray-400 line-through">{formatCurrency(product.originalPrice)}</p>
                            )}
                        </div>
                        {discount > 0 && (
                            <p className="text-green-600 font-semibold mt-1">You save {formatCurrency(product.originalPrice - product.price)} ({discount}%)</p>
                        )}
                        <button
                            onClick={() => {
                                onAddToCart(product);
                                handleClose();
                            }}
                            className="w-full mt-6 bg-orange-500 text-white py-3 rounded-lg font-bold text-lg hover:bg-orange-600 transition-colors"
                        >
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


const SideMenu: FC<{
    isOpen: boolean;
    onClose: () => void;
    navigateTo: (view: View) => void;
    setSelectedCategory: (category: string) => void;
}> = ({ isOpen, onClose, navigateTo, setSelectedCategory }) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            document.addEventListener('keydown', handleKeyDown);
        }
        return () => {
            document.body.style.overflow = 'unset';
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onClose]);
    
    const handleNavigation = (view: View, category?: string) => {
        navigateTo(view);
        if (category) {
            setSelectedCategory(category);
        }
        onClose();
    };

    return (
        <div className={`fixed inset-0 z-50 transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-black/60" onClick={onClose}></div>
            <div ref={menuRef} className={`relative flex-1 flex flex-col max-w-xs w-full bg-slate-900 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                        type="button"
                        className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                        onClick={onClose}
                    >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon className="h-6 w-6 text-white" />
                    </button>
                </div>
                <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
                    <div className="flex-shrink-0 flex items-center px-4">
                         <div onClick={() => handleNavigation('home')} className="cursor-pointer">
                            <h1 className="text-3xl font-extrabold text-orange-500">Bigi</h1>
                            <p className="text-xs text-slate-400 tracking-widest -mt-1">BUY IT, GET IT!</p>
                        </div>
                    </div>
                    <nav className="mt-8 space-y-6 px-2">
                        <div>
                            <p id="menu-title" className="px-2 text-xs font-semibold text-orange-400 uppercase tracking-wider">Shop by Category</p>
                            <div className="mt-2 space-y-1">
                                {CATEGORIES.map(category => (
                                    <a href="#" key={category} onClick={(e) => { e.preventDefault(); handleNavigation('products', category); }}
                                        className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-slate-200 hover:bg-orange-500 hover:text-white">
                                        {category}
                                    </a>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="px-2 text-xs font-semibold text-orange-400 uppercase tracking-wider">More</p>
                            <div className="mt-2 space-y-1">
                                {[
                                    { name: 'Home', view: 'home' },
                                    { name: 'About Us', view: 'aboutUs' },
                                    { name: 'Careers', view: 'careers' },
                                    { name: 'Contact Us', view: 'contactUs' },
                                    { name: 'Help Center', view: 'helpCenter' },
                                    { name: 'Friday Offers!', view: 'fridayOffers' },
                                ].map(item => (
                                    <a href="#" key={item.name} onClick={(e) => { e.preventDefault(); handleNavigation(item.view as View); }}
                                        className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-slate-200 hover:bg-orange-500 hover:text-white">
                                        {item.name}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </div>
    );
};

const Header: FC<{
    cartCount: number;
    wishlistCount: number;
    navigateTo: (view: View) => void;
    onSearch: (query: string) => void;
    onMenuOpen: () => void;
}> = ({ cartCount, wishlistCount, navigateTo, onSearch, onMenuOpen }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            onSearch(searchQuery.trim());
        }
    };

    return (
        <header className="bg-white shadow-md sticky top-0 z-40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex items-center space-x-4">
                         <button onClick={onMenuOpen} className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100">
                             <span className="sr-only">Open menu</span>
                             <Bars3Icon className="h-6 w-6" />
                         </button>
                        <div onClick={() => navigateTo('home')} className="cursor-pointer">
                            <h1 className="text-3xl font-extrabold text-orange-500">Bigi</h1>
                            <p className="hidden sm:block text-xs text-gray-500 tracking-widest -mt-1">BUY IT, GET IT!</p>
                        </div>
                    </div>
                    
                    <div className="hidden lg:flex flex-1 justify-center px-8">
                        <form onSubmit={handleSearchSubmit} className="w-full max-w-lg">
                             <div className="relative">
                                 <input
                                     type="search"
                                     value={searchQuery}
                                     onChange={(e) => setSearchQuery(e.target.value)}
                                     placeholder="Search for products..."
                                     className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500"
                                 />
                                 <button type="submit" className="absolute right-0 top-0 mt-1 mr-2 p-2 rounded-full text-orange-500 hover:text-orange-600 transition-transform transform hover:scale-110">
                                     <MagnifyingGlassIcon className="w-5 h-5" />
                                 </button>
                             </div>
                         </form>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button onClick={() => navigateTo('wishlist')} className="relative p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100">
                            <HeartIcon className="w-6 h-6" />
                            {wishlistCount > 0 && <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">{wishlistCount}</span>}
                        </button>
                        <button onClick={() => navigateTo('cart')} className="relative p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100">
                            <CartIcon className="w-6 h-6" />
                            {cartCount > 0 && <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">{cartCount}</span>}
                        </button>
                    </div>
                </div>
                 <div className="lg:hidden pb-4 px-2">
                     <form onSubmit={handleSearchSubmit}>
                         <div className="relative">
                             <input type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500" />
                             <button type="submit" className="absolute right-0 top-0 mt-1 mr-2 p-2 rounded-full text-orange-500 hover:text-orange-600 transition-transform transform hover:scale-110">
                                 <MagnifyingGlassIcon className="w-5 h-5" />
                             </button>
                         </div>
                     </form>
                 </div>
            </div>
        </header>
    );
};

const Footer: FC<{ navigateTo: (view: View) => void, setSelectedCategory: (category: string) => void }> = ({ navigateTo, setSelectedCategory }) => {
    const animatedCarts = useMemo(() => Array.from({ length: 5 }).map((_, i) => ({
        id: i,
        style: {
            animationDuration: `${Math.random() * 5 + 5}s`, // 5-10 seconds
            animationDelay: `${Math.random() * 8}s`, // 0-8 seconds delay
            top: `${Math.random() * 60 + 20}%`, // Position vertically
            transform: 'scale(0.8)',
            opacity: 0.7
        } as CSSProperties
    })), []);
    
    const handleCategoryNav = (e: React.MouseEvent, category: string) => {
        e.preventDefault();
        setSelectedCategory(category);
        navigateTo('products');
    }

    return (
        <footer className="bg-slate-900 text-slate-300 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none">
                {animatedCarts.map(cart => (
                    <CartIcon key={cart.id} className="cart-anim w-8 h-8 text-slate-700" style={cart.style} />
                ))}
            </div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white">"Bigi - Buy It, Get It!"</h2>
                    <p className="mt-2 text-slate-400">Your one-stop shop for everything you need, delivered fast.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
                    <div>
                        <h3 className="font-bold text-white uppercase tracking-wider">Shop</h3>
                        <ul className="mt-4 space-y-2">
                            {CATEGORIES.slice(0, 5).map(cat => (
                                <li key={cat}><a href="#" onClick={(e) => handleCategoryNav(e, cat)} className="hover:text-orange-400 transition-colors">{cat}</a></li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-white uppercase tracking-wider">About</h3>
                        <ul className="mt-4 space-y-2">
                            <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('aboutUs'); }} className="hover:text-orange-400 transition-colors">About Us</a></li>
                            <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('careers'); }} className="hover:text-orange-400 transition-colors">Careers</a></li>
                            <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('customerFeedbackPage'); }} className="hover:text-orange-400 transition-colors">Testimonials</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-white uppercase tracking-wider">Support</h3>
                        <ul className="mt-4 space-y-2">
                            <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('contactUs'); }} className="hover:text-orange-400 transition-colors">Contact Us</a></li>
                            <li><a href="#" onClick={(e) => { e.preventDefault(); navigateTo('helpCenter'); }} className="hover:text-orange-400 transition-colors">Help Center</a></li>
                            <li><a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors">WhatsApp</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-white uppercase tracking-wider">Connect</h3>
                        <div className="flex justify-center md:justify-start space-x-4 mt-4">
                            <a href={`https://instagram.com/${INSTAGRAM_HANDLE}`} target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors"><InstagramIcon className="w-6 h-6" /></a>
                            <a href={FACEBOOK_HANDLE} target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors"><FacebookIcon className="w-6 h-6" /></a>
                            <a href={X_HANDLE} target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors"><XIcon className="w-6 h-6" /></a>
                             <a href={LINKEDIN_HANDLE} target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors"><LinkedInIcon className="w-6 h-6" /></a>
                        </div>
                        <div className="mt-4">
                            <p className="font-semibold">Email Us:</p>
                            <a href={`mailto:${COMPANY_EMAIL}`} className="hover:text-orange-400 transition-colors">{COMPANY_EMAIL}</a>
                        </div>
                    </div>
                </div>
                <div className="mt-12 border-t border-slate-700 pt-8 text-center text-sm text-slate-400">
                    <p>&copy; {new Date().getFullYear()} Bigi. All Rights Reserved.</p>
                </div>
            </div>
        </footer>
    );
};

// --- PAGES / VIEWS ---

const HomePage: FC<{
    navigateTo: (view: View) => void;
    setSelectedCategory: (category: string) => void;
    products: Product[];
    onViewDetails: (product: Product) => void;
    onAddToCart: (product: Product) => void;
    onAddToWishlist: (product: Product) => void;
    wishlist: WishlistItem[];
}> = ({ navigateTo, setSelectedCategory, products, onViewDetails, onAddToCart, onAddToWishlist, wishlist }) => {
    const featuredProducts = useMemo(() => {
      return [...products].sort((a,b) => (b.timesOrdered || 0) - (a.timesOrdered || 0)).slice(0, 8);
    }, [products]);

    return (
      <>
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <h2 className="text-4xl md:text-6xl font-extrabold text-gray-900">Fast, Reliable, Unbeatable.</h2>
                <p className="mt-4 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">Discover a world of products at your fingertips. From the latest gadgets to everyday essentials, we've got you covered.</p>
                <button onClick={() => navigateTo('products')} className="mt-8 bg-orange-500 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-orange-600 transition-transform transform hover:scale-105">Shop All Products</button>
            </div>
        </div>

        {/* Categories Section */}
        <div className="py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h3 className="text-3xl font-bold text-center text-gray-800">Shop by Category</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-8">
                    {CATEGORIES.map(category => (
                        <div key={category} onClick={() => { navigateTo('products'); setSelectedCategory(category); }} className="bg-slate-50 p-6 rounded-lg text-center font-semibold text-gray-700 cursor-pointer hover:bg-orange-500 hover:text-white hover:shadow-lg transition-all transform hover:-translate-y-1">
                            {category}
                        </div>
                    ))}
                </div>
            </div>
        </div>
        
        {/* Featured Products */}
        {featuredProducts.length > 0 && (
          <div className="py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h3 className="text-3xl font-bold text-center text-gray-800 mb-8">Most Popular Products</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {featuredProducts.map(p => <ProductCard key={p.id} product={p} onViewDetails={onViewDetails} onAddToCart={onAddToCart} onAddToWishlist={onAddToWishlist} wishlist={wishlist}/>)}
              </div>
            </div>
          </div>
        )}
        
        {/* Testimonials Section */}
        <div className="bg-white py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h3 className="text-3xl font-bold text-center text-gray-800">What Our Customers Say</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
                    {TESTIMONIALS.slice(0, 4).map(t => (
                        <div key={t.name} className="bg-slate-50 p-6 rounded-lg">
                            <div className="flex items-center mb-4">
                                <img src={t.imageUrl} alt={t.name} className="w-12 h-12 rounded-full mr-4" />
                                <div>
                                    <p className="font-bold text-gray-800">{t.name}</p>
                                    <p className="text-sm text-gray-500">{t.location}</p>
                                </div>
                            </div>
                            <div className="flex mb-2">
                                {Array(t.stars).fill(0).map((_, i) => <StarIcon key={i} className="w-5 h-5 text-yellow-400" />)}
                                {Array(5 - t.stars).fill(0).map((_, i) => <StarIcon key={i} className="w-5 h-5 text-gray-300" />)}
                            </div>
                            <p className="text-gray-600">"{t.feedback}"</p>
                        </div>
                    ))}
                </div>
                <div className="text-center mt-8">
                    <button onClick={() => navigateTo('customerFeedbackPage')} className="text-orange-600 font-semibold hover:underline">View All Feedback</button>
                </div>
            </div>
        </div>
      </>
    );
};

const ProductListPage: FC<{
    products: Product[];
    isLoading: boolean;
    error: string | null;
    selectedCategory: string;
    setSelectedCategory: (category: string) => void;
    onViewDetails: (product: Product) => void;
    onAddToCart: (product: Product) => void;
    onAddToWishlist: (product: Product) => void;
    wishlist: WishlistItem[];
    onBack: () => void;
}> = ({ products, isLoading, error, selectedCategory, setSelectedCategory, onViewDetails, onAddToCart, onAddToWishlist, wishlist, onBack }) => (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackButton onBack={onBack} />
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
            <h2 className="text-3xl font-bold text-gray-800">{selectedCategory}</h2>
            <div className="relative">
                <select 
                    value={selectedCategory} 
                    onChange={e => setSelectedCategory(e.target.value)}
                    className="appearance-none w-full sm:w-auto bg-orange-500 text-white font-semibold rounded-lg py-2 pl-4 pr-10 text-base focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-400 focus:ring-offset-slate-100 cursor-pointer transition-all duration-300 ease-in-out shadow-md hover:bg-orange-600 hover:shadow-lg transform hover:-translate-y-0.5"
                    aria-label="Select another category"
                >
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <ChevronDownIcon className="w-5 h-5 text-orange-100 absolute top-1/2 right-3 -translate-y-1/2 pointer-events-none" />
            </div>
        </div>
        {isLoading && <LoadingSpinner />}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {!isLoading && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} onViewDetails={onViewDetails} onAddToCart={onAddToCart} onAddToWishlist={onAddToWishlist} wishlist={wishlist} />
                ))}
            </div>
        )}
    </div>
);

const SearchPage: FC<{
    products: Product[];
    isLoading: boolean;
    searchQuery: string;
    onViewDetails: (product: Product) => void;
    onAddToCart: (product: Product) => void;
    onAddToWishlist: (product: Product) => void;
    wishlist: WishlistItem[];
    onBack: () => void;
}> = ({ products, isLoading, searchQuery, onViewDetails, onAddToCart, onAddToWishlist, wishlist, onBack }) => (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <BackButton onBack={onBack} />
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Search Results for "{searchQuery}"</h2>
        {isLoading && <LoadingSpinner />}
        {!isLoading && products.length === 0 && <p className="text-center text-gray-500">No products found for your search.</p>}
        {!isLoading && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} onViewDetails={onViewDetails} onAddToCart={onAddToCart} onAddToWishlist={onAddToWishlist} wishlist={wishlist} />
                ))}
            </div>
        )}
    </div>
);

const CartPage: FC<{
    cart: CartItem[],
    navigateTo: (view: View) => void,
    updateQuantity: (productId: string, quantity: number) => void,
    removeFromCart: (productId: string) => void,
    onBack: () => void;
}> = ({ cart, navigateTo, updateQuantity, removeFromCart, onBack }) => {
    const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
    const total = subtotal + SHIPPING_COST;

    const whatsAppMessage = useMemo(() => {
        const header = `Hello Bigi! I'd like to place an order for the following items:\n\n`;
        const items = cart.map(item => `*${item.name}* (Qty: ${item.quantity}) - ${formatCurrency(item.price * item.quantity)}`).join('\n');
        const footer = `\n\n*Total: ${formatCurrency(total)}*`;
        return encodeURIComponent(header + items + footer);
    }, [cart, total]);

    if (cart.length === 0) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <h2 className="text-3xl font-bold text-gray-800">Your Cart is Empty</h2>
                <p className="text-gray-500 mt-4">Looks like you haven't added anything to your cart yet.</p>
                <button onClick={() => navigateTo('home')} className="mt-8 bg-orange-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors">Start Shopping</button>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <BackButton onBack={onBack} />
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Your Shopping Cart</h2>
                <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-start">
                    <div className="lg:col-span-8 space-y-4">
                        {cart.map(item => (
                            <div key={item.id} className="bg-white rounded-lg shadow-md p-4 flex">
                                <div className="flex-shrink-0">
                                    <img src={item.imageUrl} alt={item.name} className="w-24 h-24 sm:w-32 sm:h-32 rounded-md object-cover"/>
                                </div>
                                <div className="ml-4 sm:ml-6 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800">{item.name}</h3>
                                        <p className="text-gray-600 mt-1">{formatCurrency(item.price)}</p>
                                    </div>
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center rounded-md bg-slate-100">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-2 text-indigo-600 hover:bg-slate-200 rounded-l-md disabled:opacity-50 transition-colors" disabled={item.quantity <= 1}><MinusIcon className="w-5 h-5"/></button>
                                            <span className="px-4 text-center w-12 font-semibold text-slate-700">{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-2 text-indigo-600 hover:bg-slate-200 rounded-r-md transition-colors"><PlusIcon className="w-5 h-5"/></button>
                                        </div>
                                        <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="lg:col-span-4 mt-8 lg:mt-0">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-28 border border-slate-200">
                            <h3 className="text-xl font-semibold mb-4 text-slate-900">Order Summary</h3>
                            <div className="space-y-2 text-slate-700">
                                <div className="flex justify-between">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Shipping</span>
                                    <span>{formatCurrency(SHIPPING_COST)}</span>
                                </div>
                                <div className="flex justify-between font-bold text-lg pt-2 border-t border-slate-300 mt-2">
                                    <span className='text-slate-900'>Total</span>
                                    <span className='text-slate-900'>{formatCurrency(total)}</span>
                                </div>
                            </div>
                             <button onClick={() => navigateTo('checkout')} className="w-full mt-6 bg-indigo-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-indigo-700 transition-colors">
                                Proceed to Checkout
                            </button>
                             <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsAppMessage}`} target="_blank" rel="noopener noreferrer" className="w-full mt-3 flex items-center justify-center bg-green-500 text-white py-3 rounded-lg font-bold text-lg hover:bg-green-600 transition-colors">
                               <WhatsAppIcon className="w-6 h-6 mr-2" /> Order on WhatsApp
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const WishlistPage: FC<{
    wishlist: WishlistItem[];
    navigateTo: (view: View) => void;
    onViewDetails: (product: Product) => void;
    onAddToCart: (product: Product) => void;
    onAddToWishlist: (product: Product) => void;
    onBack: () => void;
}> = ({ wishlist, navigateTo, onViewDetails, onAddToCart, onAddToWishlist, onBack }) => {
    if (wishlist.length === 0) {
        return (
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <h2 className="text-3xl font-bold text-gray-800">Your Wishlist is Empty</h2>
                <p className="text-gray-500 mt-4">Add items you love to your wishlist to save them for later.</p>
                <button onClick={() => navigateTo('home')} className="mt-8 bg-orange-500 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-600 transition-colors">Find Something to Love</button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <BackButton onBack={onBack} />
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Your Wishlist</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {wishlist.map(item => (
                    <ProductCard key={item.id} product={item} onViewDetails={onViewDetails} onAddToCart={onAddToCart} onAddToWishlist={onAddToWishlist} wishlist={wishlist} />
                ))}
            </div>
        </div>
    );
};

const CheckoutPage: FC<{
    cart: CartItem[];
    handleCheckout: (details: DeliveryDetails) => void;
    navigateTo: (view: View) => void;
    onBack: () => void;
}> = ({ cart, handleCheckout, navigateTo, onBack }) => {
    const [details, setDetails] = useState<DeliveryDetails>({ firstName: '', lastName: '', phone: '', email: '', location: '', locationDetails: '' });
    const subtotal = useMemo(() => cart.reduce((sum, item) => sum + item.price * item.quantity, 0), [cart]);
    const total = subtotal + SHIPPING_COST;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleCheckout(details);
    };

    return (
        <div className="bg-slate-50 py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <BackButton onBack={onBack} />
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Checkout</h2>
                <div className="lg:grid lg:grid-cols-12 lg:gap-12">
                    <div className="lg:col-span-7">
                        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8">
                            <h3 className="text-xl font-semibold mb-6">Delivery Information</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                                    <input type="text" id="firstName" value={details.firstName} onChange={e => setDetails({...details, firstName: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
                                </div>
                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                                    <input type="text" id="lastName" value={details.lastName} onChange={e => setDetails({...details, lastName: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                                    <input type="tel" id="phone" value={details.phone} onChange={e => setDetails({...details, phone: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                    <input type="email" id="email" value={details.email} onChange={e => setDetails({...details, email: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
                                </div>
                                 <div className="sm:col-span-2">
                                    <label htmlFor="location" className="block text-sm font-medium text-gray-700">Delivery Location</label>
                                    <select id="location" value={details.location} onChange={e => setDetails({...details, location: e.target.value})} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required>
                                        <option value="">Select Location</option>
                                        {Object.entries(DELIVERY_LOCATIONS).map(([group, locations]) => (
                                          <optgroup label={group} key={group}>
                                            {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                                          </optgroup>
                                        ))}
                                    </select>
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="locationDetails" className="block text-sm font-medium text-gray-700">Apartment, building, etc. (Optional)</label>
                                    <textarea id="locationDetails" value={details.locationDetails} onChange={e => setDetails({...details, locationDetails: e.target.value})} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
                                </div>
                            </div>
                            <div className="mt-8">
                                <h3 className="text-xl font-semibold mb-4">Payment</h3>
                                <div className="rounded-md bg-indigo-50 p-4 border border-indigo-200">
                                    <p className="font-semibold text-indigo-900">Cash on Delivery</p>
                                    <p className="text-sm text-indigo-700 mt-1">You can pay with cash or M-Pesa when your order is delivered.</p>
                                </div>
                            </div>
                             <button type="submit" className="w-full mt-8 bg-indigo-600 text-white py-3 rounded-lg font-bold text-lg hover:bg-indigo-700 transition-colors">
                                Place Order
                            </button>
                        </form>
                    </div>
                    <div className="lg:col-span-5 mt-8 lg:mt-0">
                        <div className="bg-slate-100 rounded-lg shadow-md p-6 sticky top-28 border border-slate-200">
                            <h3 className="text-xl font-semibold mb-4 text-slate-800">Your Order</h3>
                             <ul role="list" className="divide-y divide-gray-200">
                                {cart.map(item => (
                                    <li key={item.id} className="py-4 flex">
                                        <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-md object-cover"/>
                                        <div className="ml-4 flex-1 flex justify-between">
                                            <div>
                                                <h4 className="text-md font-medium text-gray-800">{item.name}</h4>
                                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="text-md font-medium text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            <div className="border-t pt-4 mt-4 space-y-2 text-slate-700">
                                <div className="flex justify-between"><span>Subtotal</span><span className='font-medium text-slate-900'>{formatCurrency(subtotal)}</span></div>
                                <div className="flex justify-between"><span>Shipping</span><span className='font-medium text-slate-900'>{formatCurrency(SHIPPING_COST)}</span></div>
                                <div className="flex justify-between font-bold text-lg text-slate-900"><span>Total</span><span>{formatCurrency(total)}</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const OrderConfirmationPage: FC<{ order: Order | null, navigateTo: (view: View) => void }> = ({ order, navigateTo }) => {
    if (!order) {
        return (
            <div className="container mx-auto text-center py-16">
                <p>No order details to display.</p>
                <button onClick={() => navigateTo('home')} className="mt-4 text-orange-600 font-semibold">Back to Home</button>
            </div>
        );
    }
    return (
        <div className="bg-gradient-to-br from-green-50 to-teal-100 py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <CheckCircleIcon className="w-24 h-24 text-green-600 mx-auto" />
                <h2 className="text-3xl font-bold text-gray-800 mt-4">Thank you for your order!</h2>
                <p className="text-gray-600 mt-2">Your order #{order.id} has been placed successfully.</p>
                <p className="text-gray-600">We will call you shortly to confirm the details.</p>
                <div className="bg-white rounded-lg shadow-xl p-8 mt-8 text-left max-w-2xl mx-auto border border-green-200">
                    <h3 className="text-xl font-semibold mb-4 text-gray-900">Order Summary</h3>
                    <div className="space-y-4 text-gray-800">
                        {order.items.map(item => (
                            <div key={item.id} className="flex justify-between items-start">
                                <p>{item.name} <span className="text-gray-500">x {item.quantity}</span></p>
                                <p className="font-medium">{formatCurrency(item.price * item.quantity)}</p>
                            </div>
                        ))}
                    </div>
                    <div className="border-t mt-4 pt-4 space-y-2 text-gray-800">
                        <div className="flex justify-between"><p>Subtotal:</p><p>{formatCurrency(order.subtotal)}</p></div>
                        <div className="flex justify-between"><p>Shipping:</p><p>{formatCurrency(order.shipping)}</p></div>
                        <div className="flex justify-between font-bold text-lg text-gray-900"><p>Total:</p><p>{formatCurrency(order.total)}</p></div>
                    </div>
                    <div className="border-t mt-4 pt-4 text-gray-800">
                        <h4 className="font-semibold text-gray-900">Shipping to:</h4>
                        <p>{order.deliveryDetails.firstName} {order.deliveryDetails.lastName}</p>
                        <p>{order.deliveryDetails.location}</p>
                        <p>{order.deliveryDetails.phone}</p>
                    </div>
                </div>
                <button onClick={() => navigateTo('home')} className="mt-8 bg-orange-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-orange-700 transition-colors">
                    Continue Shopping
                </button>
            </div>
        </div>
    );
};

const StaticPage: FC<{ title: string, onBack: () => void, children: ReactNode }> = ({ title, onBack, children }) => (
    <div className="bg-gradient-to-b from-gray-50 to-orange-100 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <BackButton onBack={onBack} />
            <h2 className="text-4xl font-extrabold text-slate-800 mb-8">{title}</h2>
            <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 prose max-w-none prose-lg text-slate-800 prose-h3:text-orange-600 prose-a:text-orange-600 hover:prose-a:text-orange-700">
                {children}
            </div>
        </div>
    </div>
);

const AboutUsPage: FC<{ onBack: () => void }> = ({ onBack }) => (
    <div className="bg-gradient-to-b from-gray-50 to-orange-100 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <BackButton onBack={onBack} />
            <div className="text-center">
                <h2 className="text-4xl font-extrabold text-gray-800">About Bigi</h2>
                <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">We're not just an e-commerce store; we're a promise of speed, quality, and a better way to shop.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 md:p-12 mt-12 prose max-w-none prose-lg text-slate-800 prose-h3:text-orange-600">
                <h3>Our Story</h3>
                <p>Bigi wasn't born in a boardroom. It sparked from a universal frustration: the agonizingly long wait for an online order. Our founder, Shem, had the vision, but he knew he couldn't do it alone. He needed a team—an assembly of experts who shared his obsession with efficiency and customer happiness.</p>
                <p>First came Anthony, the tech wizard who could build a lightning-fast platform from scratch. Then Carlos, the marketing guru who knew how to tell our story to the world. Finally, Emmanuel, the operations master who could make our promise of rapid delivery a physical reality. Together, we're a tech-driven, customer-obsessed team on a mission to shrink the distance between you and the products you love. We're building an e-commerce experience that is seamless, reliable, and genuinely fast, because we believe that when you buy it, you should get it.</p>
            </div>

            <div className="mt-16">
                <h3 className="text-3xl font-bold text-center text-gray-800 mb-10">Meet the Dream Team</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {TEAM_MEMBERS.map(member => (
                        <div key={member.name} className="bg-white rounded-lg shadow-md text-center p-6 transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                            <img src={member.imageUrl} alt={member.name} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-orange-200" />
                            <h4 className="text-xl font-bold text-gray-900">{member.name}</h4>
                            <p className="text-orange-500 font-semibold">{member.title}</p>
                            <p className="text-slate-600 mt-2 text-sm">{member.bio}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

const CareersPage: FC<{ onBack: () => void }> = ({ onBack }) => (
    <StaticPage title="Careers at Bigi" onBack={onBack}>
        <h3>Join Our Mission</h3>
        <p>At Bigi, we're not just selling products; we're building the future of commerce in Africa, one fast delivery at a time. We're a team of innovators, problem-solvers, and collaborators driven by a shared passion for excellence. We value curiosity, speed, and a customer-first mindset. If you're looking to build something meaningful and make a tangible impact, you'll find your home here.</p>
        
        <h3>Why Work With Us?</h3>
        <ul>
            <li><strong>Build and Own:</strong> Take ownership of your work and see your ideas come to life on a platform used by thousands. Your contributions matter here.</li>
            <li><strong>Accelerate Your Growth:</strong> We're on a high-growth trajectory, offering unparalleled opportunities to tackle new challenges, expand your skills, and advance your career.</li>
            <li><strong>A Culture of Innovation:</strong> We are thinkers and doers who thrive on collaboration and transparency. We have a healthy disregard for the word "impossible."</li>
            <li><strong>Competitive Perks:</strong> We offer a competitive salary, comprehensive health benefits, and, of course, amazing staff discounts on all our products!</li>
        </ul>

        <h3>Open Positions</h3>
        <p>We are always looking for exceptional talent to join us. We believe that great people don't always fit into neat boxes, so even if you don't see a specific role listed, we want to hear from you. If you're passionate about our mission and believe you have what it takes to help us grow, we encourage you to get in touch.</p>
        <p>Please send your CV and a cover letter explaining why you'd be a great fit for our team to: <a href={`mailto:${CAREERS_EMAIL}`}>{CAREERS_EMAIL}</a></p>
        <div className="text-center mt-8">
            <a href={`mailto:${CAREERS_EMAIL}`} className="no-underline bg-orange-500 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-orange-600 transition-colors">Apply Now</a>
        </div>
    </StaticPage>
);

const HelpCenterPage: FC<{ onBack: () => void }> = ({ onBack }) => (
    <StaticPage title="Help Center" onBack={onBack}>
      <div className="space-y-8">
        {[
          { q: "How long does delivery take?", a: "For orders within Nairobi, we offer same-day delivery if placed before 2 PM. For locations in the Nairobi Metropolitan Area, delivery typically takes 1 business day. We'll always call to confirm!" },
          { q: "What are the shipping costs?", a: `Shipping is currently free (${formatCurrency(0)}) for all orders within our delivery zones.` },
          { q: "What payment methods do you accept?", a: "We primarily operate on a Cash on Delivery (COD) basis. You can pay with either cash or M-Pesa upon receiving your item." },
          { q: "How do I return an item?", a: "If you're not satisfied with your product, please contact our support team within 24 hours of delivery via WhatsApp or email. We'll arrange for a return or exchange. Please check our full return policy for more details." },
          { q: "Do you have a physical store?", a: "No, we are a fully online store. This allows us to keep our costs low and pass the savings on to you!" }
        ].map(({q, a}) => (
          <details key={q} className="p-4 rounded-lg bg-slate-100/70 hover:bg-slate-200/50 transition-colors cursor-pointer">
            <summary className="font-semibold text-lg text-slate-800">{q}</summary>
            <p className="mt-2 text-slate-700">{a}</p>
          </details>
        ))}
      </div>
    </StaticPage>
);

const FridayOffersPage: FC<{ onBack: () => void }> = ({ onBack }) => (
    <div className="bg-gradient-to-br from-orange-400 to-red-500 min-h-[60vh] flex flex-col justify-center text-center text-white py-12">
        <div className="container mx-auto px-4">
            <div className="self-start w-full"><BackButton onBack={onBack} /></div>
            <div className="flex-grow flex flex-col items-center justify-center">
                <div className="animate-pulse">
                    <GiftIcon className="w-24 h-24 text-white mx-auto" />
                </div>
                <h2 className="text-5xl font-extrabold mt-6">Friday Offers Are Coming!</h2>
                <p className="text-xl text-orange-100 mt-4 max-w-2xl mx-auto">Get ready for insane deals, exclusive discounts, and offers you won't find anywhere else. Check back this Friday to see what we've unwrapped!</p>
            </div>
        </div>
    </div>
);

const ContactUsPage: FC<{navigateTo: (view:View) => void, onBack: () => void}> = ({navigateTo, onBack}) => (
    <StaticPage title="Contact Us" onBack={onBack}>
        <p>Have a question, concern, or just want to say hello? We'd love to hear from you. Here's how you can reach us:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 not-prose">
            <div className="bg-orange-50 p-6 rounded-lg">
                <h3 className="font-bold text-xl text-orange-800 flex items-center"><EnvelopeIcon className="w-6 h-6 mr-3 text-orange-600"/> Email Support</h3>
                <p className="mt-2 text-slate-700">For general inquiries, partnership, or support.</p>
                <a href={`mailto:${COMPANY_EMAIL}`} className="font-semibold text-orange-600 hover:underline">{COMPANY_EMAIL}</a>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
                <h3 className="font-bold text-xl text-green-800 flex items-center"><WhatsAppIcon className="w-6 h-6 mr-3 text-green-600"/> WhatsApp</h3>
                <p className="mt-2 text-slate-700">For quick questions about your order or our products.</p>
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-green-600 hover:underline">Chat with us</a>
            </div>
        </div>
         <div className="mt-12">
            <h3 className="font-bold text-xl text-slate-800">Connect on Social Media</h3>
            <p className="mt-2 text-slate-700">Follow us for the latest news, offers, and updates.</p>
            <div className="flex items-center space-x-6 mt-4">
                <a href={`https://instagram.com/${INSTAGRAM_HANDLE}`} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-orange-500 transition-colors"><InstagramIcon className="w-8 h-8" /></a>
                <a href={FACEBOOK_HANDLE} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-orange-500 transition-colors"><FacebookIcon className="w-8 h-8" /></a>
                <a href={X_HANDLE} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-orange-500 transition-colors"><XIcon className="w-8 h-8" /></a>
                <a href={LINKEDIN_HANDLE} target="_blank" rel="noopener noreferrer" className="text-slate-600 hover:text-orange-500 transition-colors"><LinkedInIcon className="w-8 h-8" /></a>
            </div>
        </div>
        <p className="mt-8">You can also visit our <a href="#" onClick={(e) => { e.preventDefault(); navigateTo('helpCenter'); }}>Help Center</a> for answers to frequently asked questions.</p>
    </StaticPage>
);

const CustomerFeedbackPage: FC<{ onBack: () => void }> = ({ onBack }) => (
    <StaticPage title="Customer Feedback" onBack={onBack}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 not-prose">
             {TESTIMONIALS.map(t => (
                <div key={t.name} className="bg-slate-50 p-6 rounded-lg">
                    <div className="flex items-center mb-4">
                        <img src={t.imageUrl} alt={t.name} className="w-12 h-12 rounded-full mr-4" />
                        <div>
                            <p className="font-bold text-gray-800">{t.name}</p>
                            <p className="text-sm text-gray-500">{t.location}</p>
                        </div>
                    </div>
                    <div className="flex mb-2">
                        {Array(t.stars).fill(0).map((_, i) => <StarIcon key={i} className="w-5 h-5 text-yellow-400" />)}
                        {Array(5 - t.stars).fill(0).map((_, i) => <StarIcon key={i} className="w-5 h-5 text-gray-300" />)}
                    </div>
                    <p className="text-gray-600">"{t.feedback}"</p>
                </div>
            ))}
        </div>
    </StaticPage>
);


const FloatingWhatsAppButton: FC = () => {
    const message = encodeURIComponent("Hello Bigi! I'd like to inquire about a product or place an order.");
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;

    return (
        <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 bg-green-500 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg hover:shadow-2xl transform hover:scale-110 transition-all duration-300 ease-in-out animate-pulse-whatsapp"
            aria-label="Order via WhatsApp"
        >
            <WhatsAppIcon className="w-8 h-8" />
        </a>
    );
};


// --- MAIN APP COMPONENT ---
const App: FC = () => {
    const [view, setView] = useState<View>('home');
    const [history, setHistory] = useState<View[]>(['home']);
    const [selectedCategory, setSelectedCategory] = useState<string>(CATEGORIES[0]);
    const [productsCache, setProductsCache] = useState<Record<string, Product[]>>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [order, setOrder] = useState<Order | null>(null);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [searchResults, setSearchResults] = useState<Product[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [viewedProduct, setViewedProduct] = useState<Product | null>(null);

    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    const navigateTo = useCallback((newView: View, fromBack: boolean = false) => {
        if (!fromBack && view !== newView) {
            setHistory(prev => [...prev, newView]);
        }
        setView(newView);
        window.scrollTo(0, 0);
    }, [view]);
    
    const handleBack = useCallback(() => {
        if (history.length > 1) {
            const newHistory = [...history];
            newHistory.pop();
            const previousView = newHistory[newHistory.length - 1];
            setHistory(newHistory);
            navigateTo(previousView, true);
        }
    }, [history, navigateTo]);
    
    const addToast = (message: string, type: 'success' | 'error' = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    useEffect(() => {
        const fetchProducts = async () => {
            if (productsCache[selectedCategory]) {
                setIsLoading(false);
                return;
            }
            
            setIsLoading(true);
            setError(null);
            try {
                const fetchedProducts = await generateProductsForCategory(selectedCategory);
                setProductsCache(prev => ({ ...prev, [selectedCategory]: fetchedProducts }));
            } catch (err) {
                let errorMessage = 'Could not fetch products. Please try again later.';
                if (err instanceof Error) {
                    errorMessage = err.message;
                }
                setError(errorMessage);
                addToast(errorMessage, 'error');
            } finally {
                setIsLoading(false);
            }
        };

        if (view === 'products') {
            fetchProducts();
        }
    }, [view, selectedCategory, productsCache]);
    
    useEffect(() => {
        const performSearch = async () => {
            if (debouncedSearchQuery.length > 1) {
                setIsSearching(true);
                const results = await searchProducts(debouncedSearchQuery);
                setSearchResults(results);
                setIsSearching(false);
            } else {
                setSearchResults([]);
            }
        };
        performSearch();
    }, [debouncedSearchQuery]);

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        navigateTo('search');
    };

    const addToCart = (product: Product, quantity = 1) => {
        setCart(prevCart => {
            const existingItem = prevCart.find(item => item.id === product.id);
            if (existingItem) {
                return prevCart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
            }
            return [...prevCart, { ...product, quantity }];
        });
        addToast(`${product.name} added to cart!`);
    };

    const removeFromCart = (productId: string) => {
        setCart(prev => prev.filter(item => item.id !== productId));
        addToast('Item removed from cart.', 'error');
    };
    
    const updateQuantity = (productId: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(productId);
            return;
        }
        setCart(prev => prev.map(item => item.id === productId ? { ...item, quantity } : item));
    };

    const addToWishlist = (product: Product) => {
        setWishlist(prev => {
            if (prev.some(item => item.id === product.id)) {
                addToast(`${product.name} removed from wishlist.`, 'error');
                return prev.filter(item => item.id !== product.id);
            } else {
                addToast(`${product.name} added to wishlist!`);
                return [...prev, product];
            }
        });
    };
    
    const handleCheckout = (deliveryDetails: DeliveryDetails) => {
        const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const newOrder: Order = {
            id: `BGI-${Date.now()}`,
            items: cart,
            deliveryDetails,
            subtotal,
            shipping: SHIPPING_COST,
            total: subtotal + SHIPPING_COST,
            date: new Date().toISOString(),
        };
        setOrder(newOrder);
        setCart([]);
        navigateTo('orderConfirmation');
    };

    const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
    const currentProducts = productsCache[selectedCategory] || [];
    // Use a popular category from local data for the homepage featured products
    const featuredProducts = useMemo(() => LOCAL_PRODUCTS["Home & Kitchen"] || [], []);


    const renderView = () => {
        switch (view) {
            case 'home': return <HomePage navigateTo={navigateTo} setSelectedCategory={setSelectedCategory} products={featuredProducts} onViewDetails={setViewedProduct} onAddToCart={addToCart} onAddToWishlist={addToWishlist} wishlist={wishlist} />;
            case 'products': return <ProductListPage products={currentProducts} isLoading={isLoading} error={error} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} onViewDetails={setViewedProduct} onAddToCart={addToCart} onAddToWishlist={addToWishlist} wishlist={wishlist} onBack={handleBack} />;
            case 'search': return <SearchPage products={searchResults} isLoading={isSearching} searchQuery={searchQuery} onViewDetails={setViewedProduct} onAddToCart={addToCart} onAddToWishlist={addToWishlist} wishlist={wishlist} onBack={handleBack} />;
            case 'cart': return <CartPage cart={cart} navigateTo={navigateTo} updateQuantity={updateQuantity} removeFromCart={removeFromCart} onBack={handleBack} />;
            case 'wishlist': return <WishlistPage wishlist={wishlist} navigateTo={navigateTo} onViewDetails={setViewedProduct} onAddToCart={addToCart} onAddToWishlist={addToWishlist} onBack={handleBack} />;
            case 'checkout': return <CheckoutPage cart={cart} handleCheckout={handleCheckout} navigateTo={navigateTo} onBack={handleBack} />;
            case 'orderConfirmation': return <OrderConfirmationPage order={order} navigateTo={navigateTo} />;
            case 'aboutUs': return <AboutUsPage onBack={handleBack} />;
            case 'careers': return <CareersPage onBack={handleBack} />;
            case 'helpCenter': return <HelpCenterPage onBack={handleBack} />;
            case 'fridayOffers': return <FridayOffersPage onBack={handleBack} />;
            case 'contactUs': return <ContactUsPage navigateTo={navigateTo} onBack={handleBack} />;
            case 'customerFeedbackPage': return <CustomerFeedbackPage onBack={handleBack} />;
            default: return <HomePage navigateTo={navigateTo} setSelectedCategory={setSelectedCategory} products={featuredProducts} onViewDetails={setViewedProduct} onAddToCart={addToCart} onAddToWishlist={addToWishlist} wishlist={wishlist} />;
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <ToastContainer toasts={toasts} onDismiss={removeToast} />
            <SideMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} navigateTo={navigateTo} setSelectedCategory={setSelectedCategory} />
            <Header cartCount={cartCount} wishlistCount={wishlist.length} navigateTo={navigateTo} onSearch={handleSearch} onMenuOpen={() => setIsMenuOpen(true)} />
            <main className="flex-grow">
                {renderView()}
            </main>
            <Footer navigateTo={navigateTo} setSelectedCategory={setSelectedCategory} />
            {viewedProduct && (
                <ProductDetailModal
                    product={viewedProduct}
                    onClose={() => setViewedProduct(null)}
                    onAddToCart={addToCart}
                />
            )}
            <FloatingWhatsAppButton />
        </div>
    );
};

export default App;