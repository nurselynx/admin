"use client";
import React, { useState } from "react";
import OurServices from "./ourServices";
import HeroSection from "./heroSection";
import Secure from "./secure";
import User from "./user";

const tabs = [
  "Hero Section",
  "Our Services",
  "Secure",
  "Users",
];

export default function CMSInformation({ getData }:any) {
  const [activeTab, setActiveTab] = useState(0);

  const heroSectionData = getData?.items?.find((item:any) => item.section === 'hero section');
  const serviceSectionData = getData?.items?.find((item:any) => item.section === 'our services');
  const secureSectionData = getData?.items?.find((item:any) => item.section === 'data secure');
  const userSectionData = getData?.items?.find((item:any) => item.section === 'user testimonial');
  const commanH1Style = "text-2xl font-semibold text-lynx-blue-100 mt-2";

  return (
      <div className="  m-0 md:6 bg-white  rounded-2xl md:mx-4">
        {/* Tabs */}
        <div className="flex border-b border-gray-200 custom-scrollbar overflow-x-auto">
          {tabs.map((tab, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`py-5 px-4 text-base whitespace-pre ${
                activeTab === index
                  ? "text-lynx-blue-100 border-b-2 font-semibold border-lynx-blue-100"
                  : "text-lynx-grey-700 font-normal"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className=" p-4">
          {activeTab === 0 && (
            <>
              <h1 className={commanH1Style}>Hero Section Details</h1>
              <HeroSection getData={heroSectionData?.sectionDetail}/>
            </>
          )}

          {activeTab === 1 && (
            <>
              <h1 className={commanH1Style}>
              Our Services
              </h1>
              <OurServices getData={serviceSectionData?.sectionDetail}/>
            </>
          )}

          {activeTab === 2 && (
            <>
              <h1 className={commanH1Style}>Data is Secure with Us</h1>
              <Secure getData={secureSectionData?.sectionDetail}/>
            </>
          )}

          {activeTab === 3 && (
            <>
              <h1 className={commanH1Style}>Users Testimonial</h1>
              <User getData={userSectionData?.sectionDetail}/>
            </>
          )}
        </div>
      </div>
  );
}
