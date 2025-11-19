import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';
import { migratePhonesToDatabase } from '@/lib/migrate-data';
import { migrateImagesToBase64 } from '@/lib/migrate-images';

// Ensure data is migrated on first request
let migrated = false;
if (!migrated) {
  migratePhonesToDatabase();
  migrateImagesToBase64();
  migrated = true;
}

// GET - List all phones
export async function GET() {
  try {
    const phones = db.prepare(`
      SELECT
        id, brand, name, year_start as yearStart, year_end as yearEnd,
        kept, liked, image, image_data, created_at as createdAt, updated_at as updatedAt,
        review, network_technology as networkTechnology,
        launch_date_international as launchDateInternational,
        launch_date_france as launchDateFrance,
        dimensions, weight, sim,
        display_type as displayType, display_size as displaySize,
        display_resolution as displayResolution, display_protection as displayProtection,
        os, os_version as osVersion, chipset, cpu, gpu,
        internal_memory as internalMemory, ram,
        main_camera_specs as mainCameraSpecs, main_camera_video as mainCameraVideo,
        selfie_camera_specs as selfieCameraSpecs, selfie_camera_video as selfieCameraVideo,
        speakers, jack_35mm as jack35mm,
        wlan, bluetooth, positioning, nfc, infrared_port as infraredPort, radio, usb,
        sensors, battery_type as batteryType, battery_capacity as batteryCapacity,
        my_phone_color as myPhoneColor, my_phone_storage as myPhoneStorage
      FROM phones
      ORDER BY year_end DESC NULLS FIRST, year_start DESC
    `).all();

    // Convert integer booleans back to boolean and use image_data if available
    const formattedPhones = phones.map((phone: any) => ({
      ...phone,
      kept: Boolean(phone.kept),
      liked: Boolean(phone.liked),
      // Use image_data if available, otherwise fall back to image path
      image: phone.image_data || phone.image,
      image_data: undefined, // Don't send this to client
    }));

    return NextResponse.json(formattedPhones);
  } catch (error) {
    console.error('Error fetching phones:', error);
    return NextResponse.json(
      { error: 'Failed to fetch phones' },
      { status: 500 }
    );
  }
}

// POST - Create a new phone
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      brand, name, yearStart, yearEnd, kept, liked, image,
      review, networkTechnology, launchDateInternational, launchDateFrance,
      dimensions, weight, sim, displayType, displaySize, displayResolution,
      displayProtection, os, osVersion, chipset, cpu, gpu, internalMemory, ram,
      mainCameraSpecs, mainCameraVideo, selfieCameraSpecs, selfieCameraVideo,
      speakers, jack35mm, wlan, bluetooth, positioning, nfc, infraredPort,
      radio, usb, sensors, batteryType, batteryCapacity, myPhoneColor, myPhoneStorage
    } = body;

    // Validation
    if (!brand || !name || !yearStart || !image) {
      return NextResponse.json(
        { error: 'Missing required fields: brand, name, yearStart, image' },
        { status: 400 }
      );
    }

    // If image is a data URL (base64), store in image_data, otherwise in image
    const isDataUrl = image.startsWith('data:');

    const insert = db.prepare(`
      INSERT INTO phones (
        brand, name, year_start, year_end, kept, liked, image, image_data,
        review, network_technology, launch_date_international, launch_date_france,
        dimensions, weight, sim, display_type, display_size, display_resolution,
        display_protection, os, os_version, chipset, cpu, gpu, internal_memory, ram,
        main_camera_specs, main_camera_video, selfie_camera_specs, selfie_camera_video,
        speakers, jack_35mm, wlan, bluetooth, positioning, nfc, infrared_port,
        radio, usb, sensors, battery_type, battery_capacity, my_phone_color, my_phone_storage
      )
      VALUES (
        @brand, @name, @yearStart, @yearEnd, @kept, @liked, @image, @imageData,
        @review, @networkTechnology, @launchDateInternational, @launchDateFrance,
        @dimensions, @weight, @sim, @displayType, @displaySize, @displayResolution,
        @displayProtection, @os, @osVersion, @chipset, @cpu, @gpu, @internalMemory, @ram,
        @mainCameraSpecs, @mainCameraVideo, @selfieCameraSpecs, @selfieCameraVideo,
        @speakers, @jack35mm, @wlan, @bluetooth, @positioning, @nfc, @infraredPort,
        @radio, @usb, @sensors, @batteryType, @batteryCapacity, @myPhoneColor, @myPhoneStorage
      )
    `);

    const result = insert.run({
      brand, name, yearStart,
      yearEnd: yearEnd || null,
      kept: kept ? 1 : 0,
      liked: liked ? 1 : 0,
      image: isDataUrl ? '' : image,
      imageData: isDataUrl ? image : null,
      review: review || null,
      networkTechnology: networkTechnology || null,
      launchDateInternational: launchDateInternational || null,
      launchDateFrance: launchDateFrance || null,
      dimensions: dimensions || null,
      weight: weight || null,
      sim: sim || null,
      displayType: displayType || null,
      displaySize: displaySize || null,
      displayResolution: displayResolution || null,
      displayProtection: displayProtection || null,
      os: os || null,
      osVersion: osVersion || null,
      chipset: chipset || null,
      cpu: cpu || null,
      gpu: gpu || null,
      internalMemory: internalMemory || null,
      ram: ram || null,
      mainCameraSpecs: mainCameraSpecs || null,
      mainCameraVideo: mainCameraVideo || null,
      selfieCameraSpecs: selfieCameraSpecs || null,
      selfieCameraVideo: selfieCameraVideo || null,
      speakers: speakers || null,
      jack35mm: jack35mm || null,
      wlan: wlan || null,
      bluetooth: bluetooth || null,
      positioning: positioning || null,
      nfc: nfc || null,
      infraredPort: infraredPort || null,
      radio: radio || null,
      usb: usb || null,
      sensors: sensors || null,
      batteryType: batteryType || null,
      batteryCapacity: batteryCapacity || null,
      myPhoneColor: myPhoneColor || null,
      myPhoneStorage: myPhoneStorage || null,
    });

    const newPhone = db.prepare('SELECT * FROM phones WHERE id = ?').get(result.lastInsertRowid);

    return NextResponse.json(newPhone, { status: 201 });
  } catch (error) {
    console.error('Error creating phone:', error);
    return NextResponse.json(
      { error: 'Failed to create phone' },
      { status: 500 }
    );
  }
}
