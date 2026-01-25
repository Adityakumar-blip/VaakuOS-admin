import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress } from '@/components/ui/progress';
import { AdvancedSelect, SelectOption } from '@/components/ui/advanced-select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,

} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from 'sonner';
import { Info, AlertCircle, CheckCircle, Sparkles, Terminal, Rocket, Bell } from 'lucide-react';
import { DatePicker } from '@/components/ui/date-picker';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { addDays, format } from 'date-fns';
import { ShowcaseSurfaces } from '@/components/showcase/ShowcaseSurfaces';
import { ShowcaseNavigation } from '@/components/showcase/ShowcaseNavigation';
import { ShowcaseInteractive } from '@/components/showcase/ShowcaseInteractive';
import { ShowcaseMedia } from '@/components/showcase/ShowcaseMedia';
import { ShowcaseBulkActions } from '@/components/showcase/ShowcaseBulkActions';

const departmentOptions: SelectOption[] = [
  { value: 'marketing', label: 'Marketing' },
  { value: 'design', label: 'Design' },
  { value: 'devops', label: 'DevOps' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'sales', label: 'Sales' },
  { value: 'hr', label: 'Human Resources' },
  { value: 'finance', label: 'Finance' },
];

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
];

export default function ComponentShowcase() {
  const [singleValue, setSingleValue] = useState('');
  const [multiValue, setMultiValue] = useState<string[]>([]);
  const [switchValue, setSwitchValue] = useState(false);
  const [progress, setProgress] = useState(60);
  const [sliderValue, setSliderValue] = useState([50]);

  // Date Picker States
  const [date, setDate] = useState<Date | null>(new Date());
  const [dateTime, setDateTime] = useState<Date | null>(new Date());
  const [futureDate, setFutureDate] = useState<Date | null>(null);

  // Date Range Picker State
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: addDays(new Date(), 7),
    key: 'selection'
  });

  return (
    <div className="space-y-8 pb-20">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Component Showcase</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          A comprehensive guide to all available UI components and their states.
        </p>
      </div>

      <Tabs defaultValue="buttons" className="w-full">
        <TabsList className="mb-8 w-full justify-start h-auto flex-wrap gap-2 bg-transparent p-0">
          <TabsTrigger value="buttons" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border border-transparent data-[state=active]:border-primary px-4 py-2">Buttons & Badges</TabsTrigger>
          <TabsTrigger value="inputs" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border border-transparent data-[state=active]:border-primary px-4 py-2">Inputs & Forms</TabsTrigger>
          <TabsTrigger value="datetime" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border border-transparent data-[state=active]:border-primary px-4 py-2">Date & Time</TabsTrigger>
          <TabsTrigger value="data" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border border-transparent data-[state=active]:border-primary px-4 py-2">Data Display</TabsTrigger>
          <TabsTrigger value="bulkactions" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border border-transparent data-[state=active]:border-primary px-4 py-2">Bulk Actions</TabsTrigger>
          <TabsTrigger value="overlays" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border border-transparent data-[state=active]:border-primary px-4 py-2">Overlays</TabsTrigger>
          <TabsTrigger value="feedback" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border border-transparent data-[state=active]:border-primary px-4 py-2">Feedback</TabsTrigger>
          <TabsTrigger value="navigation" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border border-transparent data-[state=active]:border-primary px-4 py-2">Navigation</TabsTrigger>
          <TabsTrigger value="surfaces" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border border-transparent data-[state=active]:border-primary px-4 py-2">Surfaces</TabsTrigger>
          <TabsTrigger value="interactive" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border border-transparent data-[state=active]:border-primary px-4 py-2">Interactive</TabsTrigger>
          <TabsTrigger value="media" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border border-transparent data-[state=active]:border-primary px-4 py-2">Media</TabsTrigger>
        </TabsList>

        {/* Buttons Tab */}
        <TabsContent value="buttons" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-card rounded-xl border border-border p-6 shadow-soft">
              <h2 className="text-xl font-semibold text-foreground mb-6">Button Variants</h2>
              <div className="flex flex-wrap gap-3">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
            </section>

            <section className="bg-card rounded-xl border border-border p-6 shadow-soft">
              <h2 className="text-xl font-semibold text-foreground mb-6">Button Sizes</h2>
              <div className="flex flex-wrap items-center gap-3">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon"><Sparkles size={18} /></Button>
              </div>
            </section>
          </div>

          <section className="bg-card rounded-xl border border-border p-6 shadow-soft">
            <h2 className="text-xl font-semibold text-foreground mb-6">Badges</h2>
            <div className="flex flex-wrap gap-3">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
          </section>
        </TabsContent>

        {/* Inputs Tab */}
        <TabsContent value="inputs" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Text Inputs */}
            <section className="bg-card rounded-xl border border-border p-6 shadow-soft space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Text Inputs</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="default-input">Default Input</Label>
                  <Input id="default-input" placeholder="Enter text..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="disabled-input">Disabled Input</Label>
                  <Input id="disabled-input" placeholder="Disabled..." disabled />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="with-icon">Input with Label</Label>
                  <div className="relative">
                    <Input id="with-icon" placeholder="Search..." className="pl-9" />
                    <span className="absolute left-3 top-2.5 text-muted-foreground">
                      <Rocket size={16} />
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Selects */}
            <section className="bg-card rounded-xl border border-border p-6 shadow-soft space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Advanced Select</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Single Select</Label>
                  <AdvancedSelect
                    options={departmentOptions}
                    value={singleValue}
                    onChange={(val) => setSingleValue(val as string)}
                    placeholder="Select department..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Multi-Select (Dynamic Overflow)</Label>
                  <AdvancedSelect
                    options={departmentOptions}
                    value={multiValue}
                    onChange={(val) => setMultiValue(val as string[])}
                    placeholder="Select departments..."
                    multiple
                  />
                  <p className="text-xs text-muted-foreground">Resize window to test overflow</p>
                </div>
              </div>
            </section>

            {/* Radio Groups */}
            <section className="bg-card rounded-xl border border-border p-6 shadow-soft space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Radio Groups</h2>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label className="text-base">Notify me about...</Label>
                  <RadioGroup defaultValue="all">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="all" id="r1" />
                      <Label htmlFor="r1">All new messages</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="mentions" id="r2" />
                      <Label htmlFor="r2">Direct mentions only</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="none" id="r3" />
                      <Label htmlFor="r3">Nothing</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label className="text-base text-muted-foreground">Disabled State</Label>
                  <RadioGroup disabled defaultValue="option-one">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-one" id="option-one" />
                      <Label htmlFor="option-one">Option One</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="option-two" id="option-two" />
                      <Label htmlFor="option-two">Option Two</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </section>

            {/* Checkboxes */}
            <section className="bg-card rounded-xl border border-border p-6 shadow-soft space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Checkboxes</h2>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" />
                    <Label htmlFor="terms">Accept terms and conditions</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="marketing" defaultChecked />
                    <Label htmlFor="marketing">Receive marketing emails</Label>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="disabled" disabled />
                    <Label htmlFor="disabled" className="text-muted-foreground">Disabled Unchecked</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="disabled-checked" disabled defaultChecked />
                    <Label htmlFor="disabled-checked" className="text-muted-foreground">Disabled Checked</Label>
                  </div>
                </div>
              </div>
            </section>

            {/* Toggles & Sliders */}
            <section className="bg-card rounded-xl border border-border p-6 shadow-soft space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Toggles & Sliders</h2>
              <div className="space-y-6 bg-muted/20 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <Label htmlFor="airplane-mode" className="flex flex-col gap-1">
                    <span>Airplane Mode</span>
                    <span className="font-normal text-xs text-muted-foreground">Disable all network connections</span>
                  </Label>
                  <Switch id="airplane-mode" checked={switchValue} onCheckedChange={setSwitchValue} />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="disabled-switch" className="text-muted-foreground">Disabled Switch</Label>
                  <Switch id="disabled-switch" disabled />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-border">
                <div className="flex justify-between">
                  <Label>Volume Limit</Label>
                  <span className="text-sm text-muted-foreground">{sliderValue}%</span>
                </div>
                <Slider defaultValue={[50]} max={100} step={1} value={sliderValue} onValueChange={setSliderValue} />
              </div>
            </section>

            <section className="bg-card rounded-xl border border-border p-6 shadow-soft space-y-4">
              <h2 className="text-lg font-semibold text-foreground mb-4">Textarea</h2>
              <Textarea placeholder="Write your message here..." rows={4} />
            </section>
          </div>
        </TabsContent>

        {/* Date & Time Tab - NEW */}
        <TabsContent value="datetime" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-card rounded-xl border border-border p-6 shadow-soft space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Basic Selection</h2>
              <div className="space-y-4">
                <DatePicker
                  label="Select Date"
                  value={date}
                  onChange={setDate}
                  clearable
                />
                <DatePicker
                  label="Event Start (Date & Time)"
                  value={dateTime}
                  onChange={setDateTime}
                  showTimeSelect
                  dateFormat="MMMM d, yyyy h:mm aa"
                  placeholder="Select date & time"
                  clearable
                />
                <DatePicker
                  label="Year Only"
                  value={date}
                  onChange={setDate}
                  showYearPicker
                  dateFormat="yyyy"
                  placeholder="Select year"
                  clearable
                />
              </div>
            </section>

            <section className="bg-card rounded-xl border border-border p-6 shadow-soft space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Advanced Use Cases</h2>
              <div className="space-y-4">

                {/* Standard Date Range Picker */}
                <div className="p-4 border rounded-lg bg-muted/20 space-y-4">
                  <h3 className="text-sm font-medium">Standard Date Range Picker</h3>
                  <DateRangePicker
                    date={dateRange}
                    onDateChange={setDateRange}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">Default usage with range selection.</p>
                </div>

                {/* 2 Month View */}
                <div className="p-4 border rounded-lg bg-muted/20 space-y-4">
                  <h3 className="text-sm font-medium">2 Month View</h3>
                  <DateRangePicker
                    date={dateRange}
                    onDateChange={setDateRange}
                    className="w-full"
                    months={2}
                    direction="horizontal"
                  />
                  <p className="text-xs text-muted-foreground">Horizontal view showing 2 months at once.</p>
                </div>

                {/* With Sidebar (Static Ranges) */}
                <div className="p-4 border rounded-lg bg-muted/20 space-y-4">
                  <h3 className="text-sm font-medium">With Sidebar (Static Ranges)</h3>
                  <DateRangePicker
                    date={dateRange}
                    onDateChange={setDateRange}
                    className="w-full"
                    showSidebar={true}
                    months={2}
                    direction="horizontal"
                  />
                  <p className="text-xs text-muted-foreground">Includes predefined ranges like "Today", "Yesterday", etc.</p>
                </div>

                {/* Custom Day Rendering (Weekend Dot) */}
                <div className="p-4 border rounded-lg bg-muted/20 space-y-4">
                  <h3 className="text-sm font-medium">Custom Day Rendering</h3>
                  <DateRangePicker
                    date={dateRange}
                    onDateChange={setDateRange}
                    className="w-full"
                    dayContentRenderer={(date) => {
                      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                      return (
                        <div className="flex flex-col items-center justify-center relative w-full h-full">
                          <span>{format(date, "d")}</span>
                          {isWeekend && <span className="absolute bottom-1 w-1 h-1 bg-orange-500 rounded-full"></span>}
                        </div>
                      )
                    }}
                  />
                  <p className="text-xs text-muted-foreground">Example showing an orange dot for weekends.</p>
                </div>

                {/* Manual Inputs with DatePicker (Legacy/Alternative) */}
                <div className="p-4 border rounded-lg bg-muted/20 space-y-4">
                  <h3 className="text-sm font-medium">Manual Date Inputs</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <DatePicker
                      label="Start Date"
                      value={date}
                      onChange={(newDate) => {
                        setDate(newDate);
                        // If start date is after end date, clear end date
                        if (futureDate && newDate && newDate > futureDate) {
                          setFutureDate(null);
                        }
                      }}
                      selectsStart
                      startDate={date || undefined}
                      endDate={futureDate || undefined}
                      placeholder="Start"
                      clearable
                    />
                    <DatePicker
                      label="End Date"
                      value={futureDate}
                      onChange={setFutureDate}
                      selectsEnd
                      startDate={date || undefined}
                      endDate={futureDate || undefined}
                      minDate={date || new Date()} // Disable past dates relative to start
                      placeholder="End"
                      disabled={!date}
                      clearable
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Range selection using two separate inputs.</p>
                </div>

                <DatePicker
                  label="Disabled State"
                  disabled
                  placeholder="This input is disabled"
                />
              </div>
            </section>
          </div>
        </TabsContent>

        {/* Data Display Tab */}
        <TabsContent value="data" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Total Revenue</CardTitle>
                <CardDescription>Monthly overview</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">$45,231.89</p>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Subscriptions</CardTitle>
                <CardDescription>Active users</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">+2350</p>
                <p className="text-xs text-muted-foreground">+180.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Sales</CardTitle>
                <CardDescription>Completed transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">+12,234</p>
                <p className="text-xs text-muted-foreground">+19% from last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          <section className="bg-card rounded-xl border border-border p-6 shadow-soft space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Data Table</h2>
            <div className="rounded-md border">
              <Table>
                <TableCaption>A list of your recent invoices.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Invoice</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => (
                    <TableRow key={invoice.invoice}>
                      <TableCell className="font-medium">{invoice.invoice}</TableCell>
                      <TableCell>{invoice.paymentStatus}</TableCell>
                      <TableCell>{invoice.paymentMethod}</TableCell>
                      <TableCell className="text-right">{invoice.totalAmount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          <section className="bg-card rounded-xl border border-border p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-foreground mb-4">Avatars & Skeletons</h2>
            <div className="flex items-center gap-8">
              <div className="flex -space-x-3">
                <Avatar className="border-2 border-background"><AvatarFallback>JD</AvatarFallback></Avatar>
                <Avatar className="border-2 border-background"><AvatarFallback className="bg-primary text-primary-foreground">AB</AvatarFallback></Avatar>
                <Avatar className="border-2 border-background"><AvatarFallback className="bg-secondary text-secondary-foreground">MK</AvatarFallback></Avatar>
              </div>
              <div className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-3 w-[100px]" />
                </div>
              </div>
            </div>
          </section>
        </TabsContent>

        {/* Overlays Tab */}
        <TabsContent value="overlays" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="bg-card rounded-xl border border-border p-6 shadow-soft space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Dialogs</h2>
              <p className="text-muted-foreground text-sm">Modals for focusing user attention.</p>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Open Dialog</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                      Make changes to your profile here. Click save when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">Name</Label>
                      <Input id="name" value="Pedro Duarte" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="username" className="text-right">Username</Label>
                      <Input id="username" value="@peduarte" className="col-span-3" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Save changes</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </section>

            <section className="bg-card rounded-xl border border-border p-6 shadow-soft space-y-6">
              <h2 className="text-xl font-semibold text-foreground">Drawers (Sheet)</h2>
              <p className="text-muted-foreground text-sm">Slide-out panels for mobile-friendly interactions.</p>
              <Drawer>
                <DrawerTrigger asChild>
                  <Button>Open Drawer</Button>
                </DrawerTrigger>
                <DrawerContent>
                  <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                      <DrawerTitle>Move Goal</DrawerTitle>
                      <DrawerDescription>Set your daily activity goal.</DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 pb-0">
                      <div className="flex items-center justify-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 shrink-0 rounded-full"
                          onClick={() => setProgress(Math.max(0, progress - 10))}
                          disabled={progress <= 0}
                        >
                          -
                        </Button>
                        <div className="flex-1 text-center">
                          <div className="text-7xl font-bold tracking-tighter">
                            {progress}
                          </div>
                          <div className="text-[0.70rem] uppercase text-muted-foreground">
                            Calories/day
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 shrink-0 rounded-full"
                          onClick={() => setProgress(progress + 10)}
                          disabled={progress >= 400}
                        >
                          +
                        </Button>
                      </div>
                    </div>
                    <DrawerFooter>
                      <Button>Submit</Button>
                      <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </div>
                </DrawerContent>
              </Drawer>
            </section>
          </div>
        </TabsContent>

        {/* Feedback Tab */}
        <TabsContent value="feedback" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <section className="bg-card rounded-xl border border-border p-6 shadow-soft space-y-6">
            <h2 className="text-xl font-semibold text-foreground">Alerts</h2>
            <div className="space-y-4">
              <Alert>
                <Terminal className="h-4 w-4" />
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription>
                  You can add components to your app using the cli.
                </AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  Your session has expired. Please log in again.
                </AlertDescription>
              </Alert>
            </div>
          </section>

          <section className="bg-card rounded-xl border border-border p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-foreground mb-4">Toast Notifications</h2>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => toast.success('Action completed successfully!')}>
                Success Toast
              </Button>
              <Button variant="outline" onClick={() => toast.error('Something went wrong!')}>
                Error Toast
              </Button>
              <Button variant="secondary" onClick={() => toast.info('Here is some info')}>
                Info Toast
              </Button>
            </div>
          </section>

          <section className="bg-card rounded-xl border border-border p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-foreground mb-4">Tooltips</h2>
            <div className="flex flex-wrap gap-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Info size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Helpful information tooltip</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Bell size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Notifications</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <CheckCircle size={18} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Verified and approved</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </section>

          <section className="bg-card rounded-xl border border-border p-6 shadow-soft">
            <h2 className="text-lg font-semibold text-foreground mb-4">Progress</h2>
            <div className="space-y-4">
              <Progress value={progress} className="w-full" />
            </div>
          </section>
        </TabsContent>

        <TabsContent value="bulkactions">
          <ShowcaseBulkActions />
        </TabsContent>

        <TabsContent value="navigation">
          <ShowcaseNavigation />
        </TabsContent>

        <TabsContent value="surfaces">
          <ShowcaseSurfaces />
        </TabsContent>

        <TabsContent value="interactive">
          <ShowcaseInteractive />
        </TabsContent>

        <TabsContent value="media">
          <ShowcaseMedia />
        </TabsContent>
      </Tabs>
    </div>
  );
}

