import React from 'react';
import LogoUMS from '../../../public/build/assets/ums.png';

export default function ApplicationLogo(props) {
    return (
        <div className="flex items-center space-x-3" {...props}>
            <img
                src={LogoUMS}
                alt="Logo UM Surabaya"
                className="w-22 h-20 object-contain"
            />
            <div className="text-white font-bold self-center leading-none">
                <h1 className="text-7xl leading-none">ARSIP</h1>
                <p className="text-2xl uppercase tracking-widest leading-none mt-1">INFORMATIKA</p>
            </div>
        </div>
    );
}
