import { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import { bookingService } from "../../services/bookingService";

import { ACTIVE_STATUSES, COMPLETED_STATUSES } from "../../lib/bookingStatus";

import { OrderCard } from "../../components/dashboard/OrderCard";

import { Button } from "../../components/ui/Button";

import { EmptyState } from "../../components/ui/EmptyState";

import { SkeletonOrderCard } from "../../components/ui/Skeleton";

import { Package } from "lucide-react";



export function OrdersPage() {

  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);



  useEffect(() => {

    bookingService

      .list()

      .then(setBookings)

      .finally(() => setLoading(false));

  }, []);



  const { active, past } = useMemo(() => {

    const activeList = bookings.filter((b) => ACTIVE_STATUSES.includes(b.status));

    const pastList = bookings.filter(

      (b) => COMPLETED_STATUSES.includes(b.status) || b.status === "cancelled"

    );

    return { active: activeList, past: pastList };

  }, [bookings]);



  if (loading) {

    return (

      <div className="space-y-3">

        {Array.from({ length: 4 }).map((_, i) => (

          <SkeletonOrderCard key={i} />

        ))}

      </div>

    );

  }



  if (bookings.length === 0) {

    return (

      <EmptyState

        icon={Package}

        title="No sessions yet"

        message="Book your first at-home relief session."

        actionLabel="Book now →"

        onAction={() => navigate("/services")}

      />

    );

  }



  return (

    <div className="space-y-8">

      {active.length > 0 && (

        <section>

          <p className="type-label text-brand">Active</p>

          <div className="mt-3 space-y-3">

            {active.map((booking) => (

              <OrderCard key={booking.id} booking={booking} active />

            ))}

          </div>

        </section>

      )}



      {past.length > 0 && (

        <section>

          <p className="type-label text-muted">Past</p>

          <div className="mt-3 space-y-3">

            {past.map((booking) => (

              <OrderCard key={booking.id} booking={booking} />

            ))}

          </div>

        </section>

      )}



      {active.length === 0 && past.length > 0 && (

        <Button variant="secondary" className="w-full" onClick={() => navigate("/services")}>

          Book a session

        </Button>

      )}

    </div>

  );

}


