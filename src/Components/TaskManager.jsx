import React, { useState, useEffect } from 'react';

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

  useEffect(() => {
    const carregarTarefas = async () => {
      try {
        const resposta = await fetch('http://localhost:8000/tarefas');
        if (resposta.ok) {
          const tarefas = await resposta.json();
          // Aqui, supõe-se que cada tarefa do backend já venha com um 'id'
          setTasks(tarefas.map(tarefa => ({
            id: tarefa.id,
            title: tarefa.nome,
            time: tarefa.datacriacao,
            completed: tarefa.isfinalizada
          })));
        } else {
          throw new Error('Falha ao carregar tarefas');
        }
      } catch (error) {
        console.error("Erro ao carregar tarefas:", error);
      }
    };

    // Chamada da função para carregar tarefas
    carregarTarefas();
  }, []);

  const handleAddTask = async (event) => {
    event.preventDefault();
    

    const dataBackEnd = (dataRecebida) => {
      const data = new Date(dataRecebida);
      const compensarFusoHorario = data.getTime() + (data.getTimezoneOffset() * 60000);
      const dataCompensada = new Date(compensarFusoHorario);
    
      const ano = dataCompensada.getFullYear();
      const mes = dataCompensada.getMonth() + 1; // getMonth() retorna um índice baseado em zero (0-11)
      const dia = dataCompensada.getDate();
    
      const mesFormatado = mes < 10 ? `0${mes}` : mes;
      const diaFormatado = dia < 10 ? `0${dia}` : dia;
    
      return `${ano}-${mesFormatado}-${diaFormatado}`;
    }
    
    const dataParaEnviarAoBackEnd = dataBackEnd(taskTime);
    
    try {
      const response = await fetch('http://localhost:8000/tarefas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nome: taskTitle,
          datacriacao: dataParaEnviarAoBackEnd,
          isfinalizada: false,
        }),
      });
  
      const novaTarefa = await response.json();
      if (response.ok) {
        const novaTarefaFormatada = {
          id: novaTarefa.id,
          title: novaTarefa.nome,
          time: novaTarefa.datacriacao,
          completed: novaTarefa.isfinalizada,
        };
        setTasks([...tasks, novaTarefaFormatada]);
        setTaskTitle('');
        setTaskTime('');
      } else {
        throw new Error('Falha ao adicionar a tarefa');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleTaskCompletion = index => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTasks(newTasks);
  };
  
  const deleteTask = async (taskId) => {
    try {
      const response = await fetch (`http://localhost:8000/tarefas/${taskId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        // Filtra as tarefas para remover a tarefa deletada do estado
        setTasks(tasks.filter(task => task.id !== taskId));
      } else {
        // Trata o caso em que a tarefa não foi encontrada ou outro erro ocorreu
        throw new Error('Falha ao deletar a tarefa');
      }
    } catch(error) {
      console.error("Erro ao deletar a tarefa:", error);
    };
  };

  return (
    <div className="container">
      <div id="currentDate" className="date-style">
        {obterDataAtualFormatada()}
      </div>
      <h2>Adicionar Tarefa</h2>
      <form className="formulario-inputs" id="taskForm" onSubmit={handleAddTask}>
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
            <span className={`taskText ${task.completed ? 'task-completed' : ''}`}>
              {new Date(task.time).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} ⋅ {task.title}
            </span>  
            <button id="botao-check"className={`taskButton ${task.completed ? 'completed' : 'not-completed'}`} onClick={() => toggleTaskCompletion(index)}>✓</button>
            <button id="botao-x" className="taskButton" onClick={() => deleteTask(task.id)}>X</button>
          </div>
        </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskManager;
