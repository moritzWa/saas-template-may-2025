'use client';

import { Download } from 'lucide-react';
import { useState } from 'react';
import { trackDownloadIntent } from '@/lib/analytics';
import { Button } from './button';
import DownloadModal from './download-modal';

interface DownloadButtonProps {
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  variant?: 'default' | 'secondary' | 'outline';
  children?: React.ReactNode;
  location?: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  className,
  size = 'default',
  variant = 'default',
  children = 'Download',
  location = 'unknown',
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    trackDownloadIntent(location);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <Button
        onClick={handleOpenModal}
        className={className}
        size={size}
        variant={variant}
      >
        <Download className="size-4 mr-2" />
        {children}
      </Button>

      <DownloadModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default DownloadButton;
