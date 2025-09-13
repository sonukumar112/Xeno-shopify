-- Create tenants table
CREATE TABLE public.tenants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create customers table
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  total_spent DECIMAL(10,2) NOT NULL DEFAULT 0,
  order_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, email)
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  total_amount DECIMAL(10,2) NOT NULL,
  item_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(tenant_id, order_number)
);

-- Enable Row Level Security
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for tenants (public read access for demo)
CREATE POLICY "Anyone can view tenants" 
ON public.tenants 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create tenants" 
ON public.tenants 
FOR INSERT 
WITH CHECK (true);

-- Create RLS policies for customers
CREATE POLICY "Anyone can view customers" 
ON public.customers 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create customers" 
ON public.customers 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update customers" 
ON public.customers 
FOR UPDATE 
USING (true);

-- Create RLS policies for orders
CREATE POLICY "Anyone can view orders" 
ON public.orders 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create orders" 
ON public.orders 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update orders" 
ON public.orders 
FOR UPDATE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_tenants_updated_at
  BEFORE UPDATE ON public.tenants
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample tenants
INSERT INTO public.tenants (name, domain) VALUES 
('Fashion Store Pro', 'fashion-store-pro.com'),
('Tech Gadgets Inc', 'tech-gadgets-inc.com'),
('Home & Garden Co', 'home-garden-co.com');

-- Insert sample customers for Fashion Store Pro
WITH fashion_tenant AS (SELECT id FROM public.tenants WHERE domain = 'fashion-store-pro.com')
INSERT INTO public.customers (tenant_id, name, email, total_spent, order_count)
SELECT 
  ft.id,
  customer_data.name,
  customer_data.email,
  customer_data.total_spent,
  customer_data.order_count
FROM fashion_tenant ft,
(VALUES 
  ('Alice Johnson', 'alice@example.com', 2850.00, 8),
  ('Bob Smith', 'bob@example.com', 1920.50, 5),
  ('Carol Davis', 'carol@example.com', 3200.75, 12),
  ('David Wilson', 'david@example.com', 1150.25, 3),
  ('Emma Brown', 'emma@example.com', 2780.90, 9)
) AS customer_data(name, email, total_spent, order_count);

-- Insert sample orders for Fashion Store Pro
WITH fashion_tenant AS (SELECT id FROM public.tenants WHERE domain = 'fashion-store-pro.com'),
     customers AS (SELECT id, name FROM public.customers WHERE tenant_id = (SELECT id FROM fashion_tenant))
INSERT INTO public.orders (tenant_id, customer_id, order_number, status, total_amount, item_count, created_at)
SELECT 
  ft.id,
  c.id,
  order_data.order_number,
  order_data.status,
  order_data.total_amount,
  order_data.item_count,
  order_data.created_at
FROM fashion_tenant ft,
     customers c,
(VALUES 
  ('Alice Johnson', 'ORD-001', 'delivered', 299.99, 2, now() - interval '1 day'),
  ('Bob Smith', 'ORD-002', 'processing', 159.50, 1, now() - interval '2 days'),
  ('Carol Davis', 'ORD-003', 'shipped', 459.75, 3, now() - interval '3 days'),
  ('David Wilson', 'ORD-004', 'pending', 89.99, 1, now() - interval '4 days'),
  ('Emma Brown', 'ORD-005', 'delivered', 329.99, 2, now() - interval '5 days')
) AS order_data(customer_name, order_number, status, total_amount, item_count, created_at)
WHERE c.name = order_data.customer_name;