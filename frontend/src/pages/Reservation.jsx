import { useState, useEffect } from 'react';
import { getSeats, createReservation } from '../utils/api';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

function Reservation() {
  const [leftBlock, setLeftBlock] = useState({});
  const [rightBlock, setRightBlock] = useState({});
  const [selectedDays, setSelectedDays] = useState(['day1']);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    role: 'student',
    institution: '',
  });

  // Load seats when selected days change (use first selected day for display)
  useEffect(() => {
    loadSeats();
  }, [selectedDays]);

  const loadSeats = async () => {
    try {
      setLoading(true);
      // Load seats for the first selected day to show availability
      const dayToLoad = selectedDays[0] || 'day1';
      const response = await getSeats(dayToLoad);
      setLeftBlock(response.data.leftBlock || {});
      setRightBlock(response.data.rightBlock || {});
    } catch (error) {
      console.error('Error loading seats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (seat) => {
    // VIP seats cannot be selected
    if (seat.type === 'vip') {
      return;
    }

    // Reserved seats cannot be selected
    if (!seat.is_available) {
      return;
    }

    // Toggle seat selection
    if (selectedSeats.find(s => s.id === seat.id)) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear institution if role is employee
    if (name === 'role' && value === 'employee') {
      setFormData((prev) => ({
        ...prev,
        institution: '',
      }));
    }
  };

  const handleDayToggle = (day) => {
    if (day === 'all') {
      // Toggle all days
      if (selectedDays.length === 3) {
        setSelectedDays(['day1']);
      } else {
        setSelectedDays(['day1', 'day2', 'day3']);
      }
    } else {
      if (selectedDays.includes(day)) {
        // Don't allow deselecting if it's the only day
        if (selectedDays.length > 1) {
          setSelectedDays(selectedDays.filter(d => d !== day));
        }
      } else {
        setSelectedDays([...selectedDays, day]);
      }
    }
    setSelectedSeats([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedSeats.length === 0) {
      alert('Veuillez sélectionner au moins un siège');
      return;
    }

    if (selectedDays.length === 0) {
      alert('Veuillez sélectionner au moins un jour');
      return;
    }

    setSubmitting(true);

    try {
      // Build seats array with seat_id and day for each combination
      const seats = [];
      for (const seat of selectedSeats) {
        for (const day of selectedDays) {
          seats.push({
            seat_id: seat.id,
            day: day,
          });
        }
      }

      const reservationData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        role: formData.role,
        institution_name: formData.institution || null,
        days: selectedDays,
        seats: seats,
      };

      console.log('Sending reservation data:', reservationData);
      const response = await createReservation(reservationData);
      console.log('Response from server:', response.data);

      // Check if reservation was created successfully
      if (!response.data || !response.data.ticket_code) {
        throw new Error('Invalid response from server');
      }

      // Generate PDF ticket with QR code
      await generatePDFTicket(response.data);

      setShowSuccess(true);
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        role: 'student',
        institution: '',
      });
      setSelectedSeats([]);
      loadSeats();

      setTimeout(() => {
        setShowSuccess(false);
      }, 30000);
    } catch (error) {
      console.error('Error creating reservation:', error);
      console.error('Error response:', error.response?.data);
      alert(
        error.response?.data?.message || error.message || 'Échec de la réservation. Veuillez réessayer.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const generatePDFTicket = async (reservationData) => {
    const doc = new jsPDF();
    
    // QR Code data - use the ticket_code from server response
    const qrData = JSON.stringify({
      ticket_code: reservationData.ticket_code,
      email: formData.email,
    });

    console.log('Generating PDF with QR data:', qrData);

    // Generate QR Code
    const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
      width: 200,
      margin: 1,
    });

    // PDF Design
    // Header - Blue background
    doc.setFillColor(0, 106, 215); // #006AD7
    doc.rect(0, 0, 210, 40, 'F');
    
    // Event Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('AI ITRI NTIC EVENT 2026', 105, 15, { align: 'center' });
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('Tanger, Morocco', 105, 25, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text('Official Ticket', 105, 33, { align: 'center' });

    // Ticket Border
    doc.setDrawColor(0, 106, 215);
    doc.setLineWidth(1);
    doc.rect(10, 45, 190, 240);

    // Attendee Information
    doc.setTextColor(33, 39, 123); // #21277B
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('TICKET INFORMATION', 20, 60);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    
    let yPos = 75;
    const lineHeight = 10;

    // Ticket Code
    doc.setFont('helvetica', 'bold');
    doc.text('Ticket Code:', 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 106, 215);
    doc.text(reservationData.ticket_code, 60, yPos);
    doc.setTextColor(0, 0, 0);
    yPos += lineHeight;

    // Name
    doc.setFont('helvetica', 'bold');
    doc.text('Full Name:', 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(`${formData.first_name} ${formData.last_name}`, 60, yPos);
    yPos += lineHeight;

    // Email
    doc.setFont('helvetica', 'bold');
    doc.text('Email:', 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(formData.email, 60, yPos);
    yPos += lineHeight;

    // Phone
    doc.setFont('helvetica', 'bold');
    doc.text('Phone:', 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(formData.phone, 60, yPos);
    yPos += lineHeight;

    // Role
    doc.setFont('helvetica', 'bold');
    doc.text('Role:', 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.text(formData.role === 'student' ? 'Étudiant' : 'Employé', 60, yPos);
    yPos += lineHeight;

    // Institution (if student)
    if (formData.institution) {
      doc.setFont('helvetica', 'bold');
      doc.text('Institution:', 20, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(formData.institution, 60, yPos);
      yPos += lineHeight;
    }

    yPos += 5;

    // Divider line
    doc.setDrawColor(154, 217, 234); // #9AD9EA
    doc.setLineWidth(0.5);
    doc.line(20, yPos, 190, yPos);
    
    yPos += 15;

    // Seat Information
    doc.setTextColor(33, 39, 123);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('SEAT DETAILS', 20, yPos);
    yPos += 15;

    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);

    // Day
    doc.setFont('helvetica', 'bold');
    doc.text('Event Day(s):', 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 106, 215);
    doc.setFontSize(13);
    const dayLabels = selectedDays.map(d => d === 'day1' ? 'Jour 1' : d === 'day2' ? 'Jour 2' : 'Jour 3').join(', ');
    doc.text(dayLabels, 70, yPos);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    yPos += lineHeight;

    // Seat Numbers
    doc.setFont('helvetica', 'bold');
    doc.text('Seat(s):', 20, yPos);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 106, 215);
    doc.setFontSize(13);
    doc.text(selectedSeats.map(s => s.seat_number).join(', '), 60, yPos);
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);

    // QR Code
    doc.addImage(qrCodeDataUrl, 'PNG', 130, 155, 60, 60);
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Scan for verification', 160, 222, { align: 'center' });

    // Footer
    doc.setDrawColor(154, 217, 234);
    doc.setLineWidth(0.5);
    doc.line(20, 230, 190, 230);

    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('Please present this ticket at the entrance.', 105, 240, { align: 'center' });
    doc.text('Keep this ticket safe and bring it on the event day.', 105, 247, { align: 'center' });
    
    doc.setFontSize(8);
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 105, 255, { align: 'center' });

    // Watermark
    doc.setTextColor(200, 200, 200);
    doc.setFontSize(40);
    doc.setFont('helvetica', 'bold');
    doc.text('ITRI 2026', 105, 150, { align: 'center', angle: 45 });

    // Save PDF
    const fileName = `ITRI_2026_Ticket_${formData.first_name}_${formData.last_name}.pdf`;
    doc.save(fileName);
  };

  const getSeatColor = (seat) => {
    // VIP seats - dark blue, not selectable
    if (seat.type === 'vip') {
      return 'bg-[#21277B] text-white cursor-not-allowed';
    }

    // Reserved seats - gray, not selectable
    if (!seat.is_available) {
      return 'bg-gray-400 text-white cursor-not-allowed';
    }

    // Selected seats - bright blue
    if (selectedSeats.find(s => s.id === seat.id)) {
      return 'bg-[#006AD7] text-white transform scale-110';
    }

    // Available seats - light gray
    return 'bg-gray-200 hover:bg-[#9AD9EA] cursor-pointer text-gray-700';
  };

  const renderSeatBlock = (blockData, blockName) => {
    const rows = Object.keys(blockData).sort((a, b) => parseInt(a) - parseInt(b));
    
    return (
      <div className="flex-1">
        <h4 className="text-center font-bold mb-4 text-gray-700">{blockName}</h4>
        <div className="space-y-2">
          {rows.map((rowNum) => (
            <div key={`${blockName}-${rowNum}`} className="flex gap-1 justify-center">
              {blockData[rowNum]
                .sort((a, b) => a.seat_index - b.seat_index)
                .map((seat) => (
                  <button
                    key={seat.id}
                    onClick={() => handleSeatClick(seat)}
                    className={`w-10 h-10 rounded flex items-center justify-center text-sm font-semibold transition-all ${getSeatColor(seat)}`}
                    title={`Siège ${seat.seat_number} (${seat.type === 'vip' ? 'VIP' : 'Standard'})`}
                    disabled={seat.type === 'vip' || !seat.is_available}
                  >
                    {seat.seat_index}
                  </button>
                ))}
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-gray-500 mt-4">Stage This Way ↑</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen py-16 pt-32 bg-gray-50">
      {/* Header */}
      <div className="container mx-auto px-6 mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-[#21277B] mb-4">
          Réservez Votre Siège
        </h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Sélectionnez votre jour et votre siège préféré, puis remplissez le formulaire pour compléter votre réservation.
        </p>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="container mx-auto px-6 mb-8">
          <div className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-lg text-center">
            <p className="font-bold text-xl mb-2">✓ Réservation Réussie!</p>
            <p className="mb-2">Votre siège a été réservé. Votre ticket PDF a été téléchargé automatiquement.</p>
            <p className="text-sm">Vérifiez votre dossier de téléchargements pour le fichier PDF avec QR code.</p>
          </div>
        </div>
      )}

      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Seat Selection */}
          <div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-[#21277B] mb-6 text-center">1. Choisissez votre siège</h2>

              {/* Day Selector */}
              <div className="mb-6">
                <label className="block text-sm font-semibold mb-3 text-gray-700">Sélectionnez le(s) jour(s):</label>
                <div className="flex gap-2 flex-wrap">
                  {[
                    { value: 'day1', label: 'Jour 1' },
                    { value: 'day2', label: 'Jour 2' },
                    { value: 'day3', label: 'Jour 3' },
                  ].map((day) => (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => handleDayToggle(day.value)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                        selectedDays.includes(day.value)
                          ? 'bg-[#006AD7] text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {day.label}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => handleDayToggle('all')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      selectedDays.length === 3
                        ? 'bg-[#21277B] text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Les 3 Jours
                  </button>
                </div>
              </div>

              {/* Seat Legend */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex flex-wrap gap-4 justify-center">
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-gray-200 rounded mr-2"></div>
                    <span className="text-sm">Libre</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-[#006AD7] rounded mr-2"></div>
                    <span className="text-sm">Sélectionné</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-gray-400 rounded mr-2"></div>
                    <span className="text-sm">Réservé</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-6 h-6 bg-[#21277B] rounded mr-2"></div>
                    <span className="text-sm">VIP</span>
                  </div>
                </div>
              </div>

              {/* Seat Map */}
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006AD7] mx-auto"></div>
                  <p className="mt-4 text-gray-600">Chargement des sièges...</p>
                </div>
              ) : (
                <div className="flex gap-8 justify-center">
                  {renderSeatBlock(leftBlock, 'Left Block')}
                  {renderSeatBlock(rightBlock, 'Right Block')}
                </div>
              )}

              {/* Selected Seats Info */}
              {selectedSeats.length > 0 && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="font-bold text-green-700">
                    Sélectionné{selectedSeats.length > 1 ? 's' : ''}: {selectedSeats.map(s => s.seat_number).join(', ')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Reservation Form */}
          <div>
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold text-[#21277B] mb-6 text-center">2. Vos Informations</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Prénom *
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006AD7] focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">Nom *</label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006AD7] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006AD7] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Téléphone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006AD7] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">Rôle *</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006AD7] focus:border-transparent"
                  >
                    <option value="student">Étudiant</option>
                    <option value="employee">Employé</option>
                  </select>
                </div>

                {formData.role === 'student' && (
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-700">
                      Nom de l'institution *
                    </label>
                    <input
                      type="text"
                      name="institution"
                      value={formData.institution}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#006AD7] focus:border-transparent"
                    />
                  </div>
                )}

                <div className="pt-2">
                  <p className="text-sm text-gray-600 mb-4">
                    <span className="font-semibold">Jour(s) sélectionné(s):</span>{' '}
                    <span className="text-[#006AD7] font-bold">
                      {selectedDays.length === 3 
                        ? 'Les 3 Jours' 
                        : selectedDays.map(d => d === 'day1' ? 'Jour 1' : d === 'day2' ? 'Jour 2' : 'Jour 3').join(', ')}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 mb-4">
                    <span className="font-semibold">Siège(s) sélectionné(s):</span>{' '}
                    <span className="text-[#006AD7] font-bold">
                      {selectedSeats.length > 0 ? selectedSeats.map(s => s.seat_number).join(', ') : 'Aucun'}
                    </span>
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={selectedSeats.length === 0 || submitting}
                  className="w-full bg-[#006AD7] text-white py-3 rounded-lg font-bold text-lg hover:bg-[#21277B] disabled:bg-gray-400 disabled:cursor-not-allowed transform hover:scale-[1.02] transition-all"
                >
                  {submitting ? 'Traitement...' : 'Compléter la Réservation'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Reservation;
