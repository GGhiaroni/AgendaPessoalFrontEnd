import React, { useState } from 'react';

function TaskManager() {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskTime, setTaskTime] = useState('');

  const obterDataAtualFormatada = () => {
    const data = new Date();
    const opcoes = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dataFormatada = new Intl.DateTimeFormat('pt-BR', opcoes).format(data);
    const exceçãoDeUpperCase = 'de'
    const transformarMaiuscula = palavra => exceçãoDeUpperCase.includes(palavra.toLowerCase()) ? palavra.toLowerCase() : palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase();
    return dataFormatada.split(' ').map(transformarMaiuscula).join(' ');
  };

  const handleAddTask = (event) => {
    event.preventDefault(); // Previne o comportamento padrão do formulário de carregar a página após a adição de uma nova tarefa
    
    const formatarData = (dataRecebida) => {
      const partesData = dataRecebida.split('-');
      const ano = parseInt(partesData[0], 10);
      const mes = parseInt(partesData[1], 10) - 1; // Ajuste porque getMonth() começa do 0
      const dia = parseInt(partesData[2], 10);
    
      const data = new Date(ano, mes, dia);
    
      const diaFormatado = data.getDate().toString().padStart(2, '0');
      const mesFormatado = (data.getMonth() + 1).toString().padStart(2, '0'); // getMonth() retorna 0 para janeiro, 1 para fevereiro, etc.
      const anoFormatado = data.getFullYear();
    
      return `${diaFormatado}/${mesFormatado}`;
    }
    
    const newTask = { title: taskTitle, time: formatarData(taskTime), completed: false};
    setTasks([...tasks, newTask]); // Adiciona a nova tarefa à lista
    setTaskTitle(''); // Limpa o campo de título
    setTaskTime(''); // Limpa o campo de data
  };

  const toggleTaskCompletion = index => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
  };
  
  const deleteTask = index => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  return (
    <div className="container">
      <div id="currentDate" className="date-style">
        {obterDataAtualFormatada()}
      </div>
      <h2>Adicionar Tarefa</h2>
      <form class="formulario-inputs" id="taskForm" onSubmit={handleAddTask}>
        <input 
          type="text" 
          id="taskTitle" 
          placeholder="Título da Tarefa" 
          required 
          value={taskTitle} 
          onChange={(e) => setTaskTitle(e.target.value)} 
        />
        <input 
          type="date" 
          id="taskTime" 
          required 
          value={taskTime} 
          onChange={(e) => setTaskTime(e.target.value)} 
        />
        <button type="submit">Adicionar Tarefa</button>
      </form>
      <h3>Tarefas Agendadas</h3>
      <ul id="taskList">
        {tasks.map((task, index) => (
        <li key={index} style={{ backgroundColor: task.completed ? '#d4edda' : '' }}>
          <div className="taskItem">
          <span className={task.completed ? 'taskText completed' : 'taskText'}>{task.time} ⋅ {task.title}</span>
              <button id="botao-check"className={`taskButton ${task.completed ? 'completed' : 'not-completed'}`} onClick={() => toggleTaskCompletion(index)}>✓</button>
              <button id="botao-x" className="taskButton" onClick={() => deleteTask(index)}>X</button>
          </div>
        </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskManager;
