document.addEventListener('DOMContentLoaded', () => {
    // =====================================================
    // VARIABLES GLOBALES
    // =====================================================
    const eventForm = document.getElementById('event-form');
    const eventList = document.getElementById('event-list');
    const nameInput = document.getElementById('event-name');
    const dateInput = document.getElementById('event-date');
    const timeInput = document.getElementById('event-time');
    const typeInput = document.getElementById('event-type');
    
    // Array para almacenar eventos (cada evento tiene: id, name, date, time, type)
    let events = [];
    // Variable para saber qué evento estamos editando (null = nuevo evento)
    let editingEventId = null;

    // =====================================================
    // PASO 1: Cargar datos desde localStorage al iniciar
    // =====================================================
    function cargarEventos() {
        try {
            const datosGuardados = localStorage.getItem('eventos');
            if (datosGuardados) {
                events = JSON.parse(datosGuardados);
            }
        } catch (error) {
            console.error('Error al cargar eventos:', error);
            events = [];
        }
    }

    // =====================================================
    // PASO 2: Guardar eventos en localStorage
    // =====================================================
    function guardarEventos() {
        try {
            localStorage.setItem('eventos', JSON.stringify(events));
        } catch (error) {
            console.error('Error al guardar eventos:', error);
        }
    }

    // =====================================================
    // PASO 3: Crear un evento nuevo (CREATE)
    // =====================================================
    function crearEvento(nombre, fecha, hora, tipo) {
        // Generar un id único basado en la fecha y hora actual
        const nuevoId = Date.now().toString();
        
        // Crear objeto evento
        const evento = {
            id: nuevoId,
            name: nombre,
            date: fecha,
            time: hora,
            type: tipo
        };
        
        // Agregar a la lista
        events.push(evento);
        // Guardar en localStorage
        guardarEventos();
        // Actualizar la visualización
        mostrarEventos();
        alert('Evento agregado correctamente.');
    }

    // =====================================================
    // PASO 4: Mostrar/Renderizar todos los eventos (READ)
    // =====================================================
    function mostrarEventos() {
        // Limpiar la lista
        eventList.innerHTML = '';
        
        // Si no hay eventos, mostrar mensaje
        if (events.length === 0) {
            eventList.innerHTML = '<p style="color: #999;">No hay eventos programados.</p>';
            return;
        }
        
        // Recorrer cada evento y crear su elemento HTML
        events.forEach((evento) => {
            // Crear elemento <li>
            const listItem = document.createElement('li');
            listItem.id = 'evento-' + evento.id;
            listItem.className = 'evento-item';
            
            // Texto del evento
            const textoEvento = document.createElement('div');
            textoEvento.className = 'evento-texto';
            textoEvento.innerHTML = `
                <strong>${evento.name}</strong> - 
                ${evento.date} ${evento.time} - 
                <em>${evento.type}</em>
            `;
            
            // Botón editar
            const btnEditar = document.createElement('button');
            btnEditar.type = 'button';
            btnEditar.className = 'btn-editar';
            btnEditar.textContent = '✏️ Editar';
            btnEditar.onclick = () => editarEvento(evento.id);
            
            // Botón eliminar
            const btnEliminar = document.createElement('button');
            btnEliminar.type = 'button';
            btnEliminar.className = 'btn-eliminar';
            btnEliminar.textContent = '🗑️ Eliminar';
            btnEliminar.onclick = () => eliminarEvento(evento.id);
            
            // Agregar botones al contenedor
            const contenedorBotones = document.createElement('div');
            contenedorBotones.className = 'botones-accion';
            contenedorBotones.appendChild(btnEditar);
            contenedorBotones.appendChild(btnEliminar);
            
            // Armar el elemento completo
            listItem.appendChild(textoEvento);
            listItem.appendChild(contenedorBotones);
            
            // Agregar a la lista
            eventList.appendChild(listItem);
        });
    }

    // =====================================================
    // PASO 5: Editar un evento (UPDATE)
    // =====================================================
    function editarEvento(id) {
        // Buscar el evento por id
        const evento = events.find(ev => ev.id === id);
        
        if (!evento) {
            alert('Evento no encontrado.');
            return;
        }
        
        // Llenar el formulario con los datos del evento
        nameInput.value = evento.name;
        dateInput.value = evento.date;
        timeInput.value = evento.time;
        typeInput.value = evento.type;
        
        // Guardar el id del evento que estamos editando
        editingEventId = id;
        
        // Cambiar texto del botón submit
        const btnSubmit = eventForm.querySelector('button[type="submit"]');
        btnSubmit.textContent = 'Guardar cambios';
        
        // Llevar el scroll al formulario
        eventForm.scrollIntoView({ behavior: 'smooth' });
    }

    // =====================================================
    // PASO 6: Actualizar evento ya existente
    // =====================================================
    function actualizarEvento(id, nombre, fecha, hora, tipo) {
        // Buscar el índice del evento
        const indice = events.findIndex(ev => ev.id === id);
        
        if (indice === -1) {
            alert('Evento no encontrado.');
            return;
        }
        
        // Actualizar los datos del evento
        events[indice].name = nombre;
        events[indice].date = fecha;
        events[indice].time = hora;
        events[indice].type = tipo;
        
        // Guardar en localStorage
        guardarEventos();
        // Actualizar la visualización
        mostrarEventos();
        alert('Evento actualizado correctamente.');
    }

    // =====================================================
    // PASO 7: Eliminar un evento (DELETE)
    // =====================================================
    function eliminarEvento(id) {
        // Pedir confirmación al usuario
        if (!confirm('¿Estás seguro que deseas eliminar este evento?')) {
            return; // Si responde "No", no hacer nada
        }
        
        // Filtrar: mantener todos EXCEPTO el que tiene el id especificado
        events = events.filter(evento => evento.id !== id);
        
        // Guardar en localStorage
        guardarEventos();
        // Actualizar la visualización
        mostrarEventos();
        alert('Evento eliminado correctamente.');
    }

    // =====================================================
    // PASO 8: Manejar envío del formulario
    // =====================================================
    eventForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Obtener valores del formulario
        const nombre = nameInput.value.trim();
        const fecha = dateInput.value.trim();
        const hora = timeInput.value.trim();
        const tipo = typeInput.value.trim();
        
        // Validar que no estén vacíos
        if (!nombre || !fecha || !hora || !tipo) {
            alert('Por favor, completa todos los campos.');
            return;
        }
        
        // Si hay un evento siendo editado, actualizar
        if (editingEventId !== null) {
            actualizarEvento(editingEventId, nombre, fecha, hora, tipo);
            // Limpiar el estado de edición
            editingEventId = null;
            eventForm.querySelector('button[type="submit"]').textContent = 'Agregar Evento';
        } else {
            // Si no, crear uno nuevo
            // Verificar que no sea duplicado (mismo nombre, fecha y hora)
            const duplicado = events.some(ev => 
                ev.name === nombre && ev.date === fecha && ev.time === hora
            );
            
            if (duplicado) {
                alert('Ya existe un evento con el mismo nombre, fecha y hora.');
                return;
            }
            
            crearEvento(nombre, fecha, hora, tipo);
        }
        
        // Limpiar formulario
        eventForm.reset();
    });

    // =====================================================
    // PASO 9: Inicializar la aplicación
    // =====================================================
    cargarEventos();
    mostrarEventos();
});