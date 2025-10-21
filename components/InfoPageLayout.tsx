import React from 'react';

interface InfoPageLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

const InfoPageLayout: React.FC<InfoPageLayoutProps> = ({ title, subtitle, children }) => {
  return (
    <div className="bg-gray-900 pt-32 pb-16 sm:pt-40 sm:pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tighter text-white sm:text-6xl">
              {title}
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-300">
              {subtitle}
            </p>
          </div>
          <div className="mt-16">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoPageLayout;