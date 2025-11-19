import { NextRequest, NextResponse } from 'next/server';
import db from '@/lib/db';

// GET - Get a single phone by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const phone = db.prepare(`
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
      WHERE id = ?
    `).get(params.id) as any;

    if (!phone) {
      return NextResponse.json(
        { error: 'Phone not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...phone,
      kept: Boolean(phone.kept),
      liked: Boolean(phone.liked),
      // Use image_data if available, otherwise fall back to image path
      image: phone.image_data || phone.image,
      image_data: undefined, // Don't send this to client
    });
  } catch (error) {
    console.error('Error fetching phone:', error);
    return NextResponse.json(
      { error: 'Failed to fetch phone' },
      { status: 500 }
    );
  }
}

// PUT - Update a phone
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // If image is a data URL (base64), store in image_data, otherwise in image
    const isDataUrl = image?.startsWith('data:');

    const update = db.prepare(`
      UPDATE phones
      SET brand = @brand,
          name = @name,
          year_start = @yearStart,
          year_end = @yearEnd,
          kept = @kept,
          liked = @liked,
          image = @image,
          image_data = @imageData,
          review = @review,
          network_technology = @networkTechnology,
          launch_date_international = @launchDateInternational,
          launch_date_france = @launchDateFrance,
          dimensions = @dimensions,
          weight = @weight,
          sim = @sim,
          display_type = @displayType,
          display_size = @displaySize,
          display_resolution = @displayResolution,
          display_protection = @displayProtection,
          os = @os,
          os_version = @osVersion,
          chipset = @chipset,
          cpu = @cpu,
          gpu = @gpu,
          internal_memory = @internalMemory,
          ram = @ram,
          main_camera_specs = @mainCameraSpecs,
          main_camera_video = @mainCameraVideo,
          selfie_camera_specs = @selfieCameraSpecs,
          selfie_camera_video = @selfieCameraVideo,
          speakers = @speakers,
          jack_35mm = @jack35mm,
          wlan = @wlan,
          bluetooth = @bluetooth,
          positioning = @positioning,
          nfc = @nfc,
          infrared_port = @infraredPort,
          radio = @radio,
          usb = @usb,
          sensors = @sensors,
          battery_type = @batteryType,
          battery_capacity = @batteryCapacity,
          my_phone_color = @myPhoneColor,
          my_phone_storage = @myPhoneStorage,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = @id
    `);

    const result = update.run({
      id: params.id,
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

    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Phone not found' },
        { status: 404 }
      );
    }

    const updatedPhone = db.prepare('SELECT * FROM phones WHERE id = ?').get(params.id);
    return NextResponse.json(updatedPhone);
  } catch (error) {
    console.error('Error updating phone:', error);
    return NextResponse.json(
      { error: 'Failed to update phone' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a phone
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = db.prepare('DELETE FROM phones WHERE id = ?').run(params.id);

    if (result.changes === 0) {
      return NextResponse.json(
        { error: 'Phone not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Phone deleted successfully' });
  } catch (error) {
    console.error('Error deleting phone:', error);
    return NextResponse.json(
      { error: 'Failed to delete phone' },
      { status: 500 }
    );
  }
}
