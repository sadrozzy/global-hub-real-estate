import { NextRequest, NextResponse } from 'next/server';
import postgres from 'postgres';

// Database connection
const sql = postgres(process.env.DATABASE_URL || "", { ssl: "require" });

interface ContactFormData {
  fullName: string;
  email: string;
  phone: string;
  message: string;
  source: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();
    
    // Validate required fields
    const { fullName, email, phone, message, source } = body;
    
    if (!fullName || !email || !phone || !message || !source) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Insert into database
    const response = await sql`
      INSERT INTO tb_common_feedback (full_name, email, phone, message, source)
      VALUES (${fullName}, ${email}, ${phone}, ${message}, ${source})
      RETURNING feedback_id, created_at
    `;
    
    if (response && response.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Form submitted successfully',
        data: {
          id: response[0].feedback_id,
          createdAt: response[0].created_at
        }
      });
    } else {
      return NextResponse.json(
        { error: 'Failed to insert record' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Error submitting contact form:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
