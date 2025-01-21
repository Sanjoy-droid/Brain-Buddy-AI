// import { NextResponse } from "next/server";
// import axios from "axios";
//
// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//
//     const response = await axios({
//       method: "POST",
//       url: process.env.GEMINI_API_URL,
//       headers: {
//         "Content-Type": "application/json",
//       },
//       data: {
//         contents: [
//           {
//             parts: [{ text: body.prompt }],
//           },
//         ],
//       },
//       params: {
//         key: process.env.GEMINI_API_KEY,
//       },
//     });
//
//     return NextResponse.json(response.data);
//   } catch (error) {
//     console.error("Error:", error);
//     return NextResponse.json(
//       { error: "Failed to generate response" },
//       { status: 500 },
//     );
//   }
// }
//
//
