"use client";

import { Phone } from "@/types/phone";
import { useLanguage } from "@/contexts/language-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Heart, Smartphone, ThumbsDown, ThumbsUp } from "lucide-react";
import Image from "next/image";

interface PhoneDetailProps {
  phone: Phone | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PhoneDetail({ phone, open, onOpenChange }: PhoneDetailProps) {
  const { t } = useLanguage();

  if (!phone) return null;

  const SpecItem = ({ label, value }: { label: string; value: string | null | undefined }) => {
    if (!value) return null;
    return (
      <div className="flex justify-between py-2 border-b border-border/30">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-right max-w-[60%]">{value}</span>
      </div>
    );
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => {
    return (
      <div className="space-y-2">
        <h3 className="text-lg font-semibold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          {title}
        </h3>
        <div className="space-y-1">{children}</div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto glass">
        <DialogHeader>
          <div className="flex items-start gap-4">
            <div className="relative flex-shrink-0">
              <Image
                src={phone.image}
                alt={`${phone.brand} ${phone.name}`}
                width={120}
                height={120}
                className="rounded-lg"
              />
            </div>
            <div className="flex-grow">
              <DialogTitle className="text-2xl font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                {phone.brand} {phone.name}
              </DialogTitle>
              <DialogDescription className="text-base mt-2">
                {t('owned')}: {phone.yearStart} - {phone.yearEnd || t('present')}
              </DialogDescription>
              <div className="flex flex-wrap gap-2 mt-3">
                {phone.yearEnd === null && (
                  <Badge variant="secondary" className="flex items-center space-x-1 glass border-cyan-400/30">
                    <Smartphone className="w-3 h-3 text-cyan-400" />
                    <span>{t('current')}</span>
                  </Badge>
                )}
                {phone.kept && (
                  <Badge variant="outline" className="flex items-center space-x-1 glass border-pink-400/30">
                    <Heart className="w-3 h-3 text-pink-400" />
                    <span>{t('kept')}</span>
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className={`flex items-center space-x-1 glass ${
                    phone.liked ? 'border-green-400/30' : 'border-red-400/30'
                  }`}
                >
                  {phone.liked ? (
                    <>
                      <ThumbsUp className="w-3 h-3 text-green-400" />
                      <span>{t('liked')}</span>
                    </>
                  ) : (
                    <>
                      <ThumbsDown className="w-3 h-3 text-red-400" />
                      <span>{t('dislikedPhones')}</span>
                    </>
                  )}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-6">
          {phone.review && (
            <Section title={t('myReview')}>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{phone.review}</p>
            </Section>
          )}

          <Section title={t('specifications')}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Network */}
              {phone.networkTechnology && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-cyan-400">{t('network')}</h4>
                  <SpecItem label={t('networkTechnology')} value={phone.networkTechnology} />
                </div>
              )}

              {/* Launch */}
              {(phone.launchDateInternational || phone.launchDateFrance) && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-cyan-400">{t('launch')}</h4>
                  <SpecItem label={t('launchDateInternational')} value={phone.launchDateInternational} />
                  <SpecItem label={t('launchDateFrance')} value={phone.launchDateFrance} />
                </div>
              )}

              {/* Body */}
              {(phone.dimensions || phone.weight || phone.sim) && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-cyan-400">{t('body')}</h4>
                  <SpecItem label={t('dimensions')} value={phone.dimensions} />
                  <SpecItem label={t('weight')} value={phone.weight} />
                  <SpecItem label={t('sim')} value={phone.sim} />
                </div>
              )}

              {/* Display */}
              {(phone.displayType || phone.displaySize || phone.displayResolution || phone.displayProtection) && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-cyan-400">{t('display')}</h4>
                  <SpecItem label={t('displayType')} value={phone.displayType} />
                  <SpecItem label={t('displaySize')} value={phone.displaySize} />
                  <SpecItem label={t('displayResolution')} value={phone.displayResolution} />
                  <SpecItem label={t('displayProtection')} value={phone.displayProtection} />
                </div>
              )}

              {/* Platform */}
              {(phone.os || phone.osVersion || phone.chipset || phone.cpu || phone.gpu) && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-cyan-400">{t('platform')}</h4>
                  <SpecItem label={t('os')} value={phone.os} />
                  <SpecItem label={t('osVersion')} value={phone.osVersion} />
                  <SpecItem label={t('chipset')} value={phone.chipset} />
                  <SpecItem label={t('cpu')} value={phone.cpu} />
                  <SpecItem label={t('gpu')} value={phone.gpu} />
                </div>
              )}

              {/* Memory */}
              {(phone.internalMemory || phone.ram) && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-cyan-400">{t('memory')}</h4>
                  <SpecItem label={t('internalMemory')} value={phone.internalMemory} />
                  <SpecItem label={t('ram')} value={phone.ram} />
                </div>
              )}

              {/* Main Camera */}
              {(phone.mainCameraSpecs || phone.mainCameraVideo) && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-cyan-400">{t('mainCamera')}</h4>
                  <SpecItem label={t('cameraSpecs')} value={phone.mainCameraSpecs} />
                  <SpecItem label={t('cameraVideo')} value={phone.mainCameraVideo} />
                </div>
              )}

              {/* Selfie Camera */}
              {(phone.selfieCameraSpecs || phone.selfieCameraVideo) && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-cyan-400">{t('selfieCamera')}</h4>
                  <SpecItem label={t('cameraSpecs')} value={phone.selfieCameraSpecs} />
                  <SpecItem label={t('cameraVideo')} value={phone.selfieCameraVideo} />
                </div>
              )}

              {/* Sound */}
              {(phone.speakers || phone.jack35mm) && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-cyan-400">{t('sound')}</h4>
                  <SpecItem label={t('speakers')} value={phone.speakers} />
                  <SpecItem label={t('jack35mm')} value={phone.jack35mm} />
                </div>
              )}

              {/* Communication */}
              {(phone.wlan || phone.bluetooth || phone.positioning || phone.nfc || phone.infraredPort || phone.radio || phone.usb) && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-cyan-400">{t('communication')}</h4>
                  <SpecItem label={t('wlan')} value={phone.wlan} />
                  <SpecItem label={t('bluetooth')} value={phone.bluetooth} />
                  <SpecItem label={t('positioning')} value={phone.positioning} />
                  <SpecItem label={t('nfc')} value={phone.nfc} />
                  <SpecItem label={t('infraredPort')} value={phone.infraredPort} />
                  <SpecItem label={t('radio')} value={phone.radio} />
                  <SpecItem label={t('usb')} value={phone.usb} />
                </div>
              )}

              {/* Features */}
              {phone.sensors && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-cyan-400">{t('features')}</h4>
                  <SpecItem label={t('sensors')} value={phone.sensors} />
                </div>
              )}

              {/* Battery */}
              {(phone.batteryType || phone.batteryCapacity) && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-cyan-400">{t('battery')}</h4>
                  <SpecItem label={t('batteryType')} value={phone.batteryType} />
                  <SpecItem label={t('batteryCapacity')} value={phone.batteryCapacity} />
                </div>
              )}

              {/* My Phone */}
              {(phone.myPhoneColor || phone.myPhoneStorage) && (
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-cyan-400">{t('myPhone')}</h4>
                  <SpecItem label={t('color')} value={phone.myPhoneColor} />
                  <SpecItem label={t('storage')} value={phone.myPhoneStorage} />
                </div>
              )}
            </div>
          </Section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
