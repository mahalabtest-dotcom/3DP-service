import type { RequestStatus } from "@/lib/types";

export type AdminRequest = {
  id: string;
  model_id: string;
  model_title: string;
  color_name: string;
  color_hex: string;
  pickup_name: string;
  customer_name: string;
  phone: string;
  email: string;
  payroll_id: string;
  status: RequestStatus;
  estimated_print_time: number;
  created_at: string;
};

const now = Date.now();
const ago = (ms: number) => new Date(now - ms).toISOString();

export const MOCK_REQUESTS: AdminRequest[] = [
  {
    id: "req1",
    model_id: "m5",
    model_title: "Cable Management Clip",
    color_name: "Black",
    color_hex: "#1C2B2A",
    pickup_name: "Al Sheraa",
    customer_name: "Ahmed Al Mansoori",
    phone: "+971 50 123 4567",
    email: "ahmed.almansoori@dewa.ae",
    payroll_id: "EMP-9912",
    status: "new",
    estimated_print_time: 90,
    created_at: ago(35 * 60 * 1000),
  },
  {
    id: "req2",
    model_id: "m2",
    model_title: "ID Badge Holder",
    color_name: "White",
    color_hex: "#F5F5F5",
    pickup_name: "Hudaiba",
    customer_name: "Fatima Al Rashidi",
    phone: "+971 55 234 5678",
    email: "f.alrashidi@dewa.ae",
    payroll_id: "EMP-44321",
    status: "in_progress",
    estimated_print_time: 45,
    created_at: ago(3 * 60 * 60 * 1000),
  },
  {
    id: "req3",
    model_id: "m3",
    model_title: "Mounting Bracket — L Type",
    color_name: "Grey",
    color_hex: "#9CA3AF",
    pickup_name: "Al Quoz",
    customer_name: "Mohammed Hassan Al Zaabi",
    phone: "+971 52 345 6789",
    email: "m.hassan@dewa.ae",
    payroll_id: "EMP-33201",
    status: "ready",
    estimated_print_time: 120,
    created_at: ago(26 * 60 * 60 * 1000),
  },
  {
    id: "req4",
    model_id: "m7",
    model_title: "Door Room Sign Holder",
    color_name: "Black",
    color_hex: "#1C2B2A",
    pickup_name: "Al Ruwayyah",
    customer_name: "Sara Khalid Al Zaabi",
    phone: "+971 56 456 7890",
    email: "s.alzaabi@dewa.ae",
    payroll_id: "EMP-12890",
    status: "completed",
    estimated_print_time: 75,
    created_at: ago(50 * 60 * 60 * 1000),
  },
  {
    id: "req5",
    model_id: "m8",
    model_title: "Network Patch Cable Clip",
    color_name: "Black",
    color_hex: "#1C2B2A",
    pickup_name: "Al Sheraa",
    customer_name: "Khalid Rashid Al Mazrouei",
    phone: "+971 58 567 8901",
    email: "k.mazrouei@dewa.ae",
    payroll_id: "EMP-78901",
    status: "new",
    estimated_print_time: 60,
    created_at: ago(18 * 60 * 1000),
  },
  {
    id: "req6",
    model_id: "m1",
    model_title: "Desk Phone Stand",
    color_name: "Grey",
    color_hex: "#9CA3AF",
    pickup_name: "Hudaiba",
    customer_name: "Noura Ahmed Al Suwaidi",
    phone: "+971 50 678 9012",
    email: "n.alsuwaidi@dewa.ae",
    payroll_id: "EMP-22456",
    status: "in_progress",
    estimated_print_time: 150,
    created_at: ago(5 * 60 * 60 * 1000),
  },
];
